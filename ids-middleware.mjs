// ids-middleware.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ALERTS_FILE = path.join(__dirname, 'ids-alerts.json');
const LOG_FILE = path.join(__dirname, 'ids.log');

if (!fs.existsSync(ALERTS_FILE)) fs.writeFileSync(ALERTS_FILE, '[]');

function appendLog(line){
  fs.appendFileSync(LOG_FILE, `${new Date().toISOString()} ${line}\n`);
}

function saveAlert(alert){
  const arr = JSON.parse(fs.readFileSync(ALERTS_FILE, 'utf8') || '[]');
  arr.unshift(alert);
  if (arr.length > 2000) arr.pop();
  fs.writeFileSync(ALERTS_FILE, JSON.stringify(arr, null, 2));
  appendLog(`[ALERT] ${alert.type} ${alert.ip} ${alert.endpoint} ${alert.signature || ''}`);

  // terminal notification
  console.log(`\x1b[31m🚨 [IDS] Detected ${alert.type} from ${alert.ip} → ${alert.endpoint}\x1b[0m`);
}

// Build payload only from potentially attacker-controlled inputs (body + query), not raw path
function buildPayload({ method, url, headers, body, query }) {
  const parts = [];

  // include JSON body only if present and non-empty
  try {
    if (body && Object.keys(body).length > 0) parts.push(JSON.stringify(body));
  } catch (e) {}

  // include query string parameters only if present
  try {
    if (query && Object.keys(query).length > 0) parts.push(JSON.stringify(query));
  } catch (e) {}

  // include user-agent for UA-based signatures
  if (headers && headers['user-agent']) parts.push(headers['user-agent']);

  return parts.join(' ').toLowerCase();
}

function detectAttack({ method, url, headers, ip, body, query }){
  // build payload from body/query/ua (avoid using raw URL path to reduce false positives)
  const payload = buildPayload({ method, url, headers, body, query });

  const signatures = [
    // keep sensible regexes — these look for actual payload markers in body/query
    { type: 'SQLi', regex: /(union select|select .* from|drop table|insert into|or\s+1=1|--|;--)/i },
    { type: 'XSS', regex: /(<script|<\/script>|onerror\s*=|javascript:|<img[^>]*src=)/i },
    { type: 'LFI', regex: /(\.\.\/|\.\.\\|etc\/passwd|php:\/\/input)/i },
    { type: 'CMD_INJECTION', regex: /(\b(exec|system|popen|passthru)\s*\(|[`$()];)/i },
    { type: 'WP_LOGIN_BRUTE', regex: /(wp-login\.php|xmlrpc\.php)/i },
    { type: 'SUSPICIOUS_UA', regex: /(sqlmap|fuzzer|nikto|acunetix|netsparker)/i }
  ];

  // if payload is empty (e.g., plain GET for static html), skip scanning
  if (!payload || payload.trim().length === 0) {
    return { matched: false };
  }

  for (const s of signatures){
    if (s.regex.test(payload)){
      return { matched: true, type: s.type, signature: s.regex.toString(), matchedPayload: payload };
    }
  }
  return { matched: false };
}

export default function createIDS(opts = {}) {
  const rateWindow = opts.rateWindowMs || 60_000;
  const maxRequests = opts.maxRequests || 80;
  const ipCounts = new Map();
  const blocked = new Set();

  // option to ignore local addresses to avoid noisy localhost tests (default: true)
  const skipLocal = ('skipLocal' in opts) ? !!opts.skipLocal : true;

  // cleanup
  setInterval(()=>{
    const now = Date.now();
    for (const [ip, arr] of ipCounts){
      const filtered = arr.filter(t => now - t < rateWindow);
      if (filtered.length === 0) ipCounts.delete(ip);
      else ipCounts.set(ip, filtered);
    }
  }, 30_000);

  return function idsMiddleware(req, res, next){
    const ip = (req.ip || req.headers['x-forwarded-for'] || (req.connection && req.connection.remoteAddress) || 'unknown').toString();

    // optionally ignore localhost traffic to reduce noise
    if (skipLocal && (ip === '::1' || ip === '127.0.0.1' || ip === '::ffff:127.0.0.1')) {
      return next();
    }

    if (blocked.has(ip)){
      appendLog(`[BLOCKED_REQUEST] ${ip} ${req.method} ${req.originalUrl}`);
      return res.status(403).send('Forbidden');
    }

    // rate counting
    const now = Date.now();
    const arr = ipCounts.get(ip) || [];
    arr.push(now);
    ipCounts.set(ip, arr);
    const recentCount = arr.filter(t => now - t < rateWindow).length;
    if (recentCount > maxRequests){
      const alert = {
        time: new Date().toISOString(),
        ip, endpoint: req.originalUrl, type: 'RATE_LIMIT',
        signature: `> ${recentCount} reqs/${Math.round(rateWindow/1000)}s`
      };
      saveAlert(alert);
      blocked.add(ip);
      appendLog(`[BLOCKED_RATE] ${ip} count=${recentCount}`);
      setTimeout(()=> blocked.delete(ip), opts.blockTimeMs || 60_000);
      return res.status(429).send('Too Many Requests');
    }

    // Skip detection for static assets & safe GETs:
    const staticExts = ['.js','.css','.png','.jpg','.jpeg','.gif','.svg','.ico','.woff','.woff2','.ttf','.map'];
    const urlLower = (req.originalUrl || '').toLowerCase();
    for (const ext of staticExts){
      if (urlLower.endsWith(ext)) return next();
    }
    // also skip simple GETs with no query string/body
    if (req.method === 'GET' && (!req.query || Object.keys(req.query).length === 0) && (!req.body || Object.keys(req.body).length === 0)) {
      return next();
    }

    // detection — only using body & query (not raw path)
    const d = detectAttack({
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      ip,
      body: req.body || {},
      query: req.query || {}
    });

    if (d.matched){
      const alert = {
        time: new Date().toISOString(),
        ip,
        endpoint: req.originalUrl,
        method: req.method,
        type: d.type,
        signature: d.signature,
        userAgent: req.headers['user-agent'] || '',
      };
      // include matched payload sample for debugging
      alert.debug = { matchedPayload: d.matchedPayload };

      // persist alert and log
      saveAlert(alert);

      // extra terminal / log details (raw)
      appendLog(`[DETECT_RAW] ${ip} ${req.method} ${req.originalUrl} payload=${JSON.stringify(alert.debug.matchedPayload).slice(0,200)}`);

      if (opts.blockOnDetect){
        blocked.add(ip);
        setTimeout(()=> blocked.delete(ip), opts.detectBlockMs || 120_000);
        appendLog(`[DETECT_BLOCK] ${ip} ${d.type}`);
        return res.status(403).send('Suspicious activity detected');
      }
    }
    next();
  };
}
