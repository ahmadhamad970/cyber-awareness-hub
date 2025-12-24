// ids-server.mjs
import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';
import createIDS from './ids-middleware.mjs';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const PORT = process.env.PORT || 3333;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

const idsMiddleware = createIDS({
  maxRequests: 120,
  rateWindowMs: 60_000,
  blockOnDetect: false,
  blockTimeMs: 2 * 60_1000,
  detectBlockMs: 2 * 60_1000
});

const ALERTS_FILE = path.join(__dirname, 'ids-alerts.json');
if (!fs.existsSync(ALERTS_FILE)) fs.writeFileSync(ALERTS_FILE, '[]');

const app = express();
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Mount IDS middleware for all app routes except the telemetry endpoints
app.use((req, res, next) => {
  if (req.path.startsWith('/events') || req.path.startsWith('/ids-admin') || req.path.startsWith('/public')) return next();
  return idsMiddleware(req, res, next);
});

const clients = [];

app.get('/events', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });
  res.flushHeaders?.();
  const clientId = Date.now();
  clients.push({ id: clientId, res });
  req.on('close', () => {
    const idx = clients.findIndex(c => c.id === clientId);
    if (idx !== -1) clients.splice(idx, 1);
  });
});

function pushAlert(alert){
  const arr = JSON.parse(fs.readFileSync(ALERTS_FILE, 'utf8') || '[]');
  arr.unshift(alert);
  if (arr.length > 2000) arr.pop();
  fs.writeFileSync(ALERTS_FILE, JSON.stringify(arr, null, 2));

  clients.forEach(c => {
    try {
      c.res.write(`data: ${JSON.stringify(alert)}\n\n`);
    } catch(e){}
  });

  if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID){
    const text = `⚠️ IDS Alert\nType: ${alert.type}\nIP: ${alert.ip}\nEndpoint: ${alert.endpoint}\nTime: ${alert.time}`;
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text })
    }).catch(()=>{});
  }
}

app.get('/alerts.json', (req, res) => {
  const arr = JSON.parse(fs.readFileSync(ALERTS_FILE, 'utf8') || '[]');
  res.json(arr);
});

app.post('/ids-admin/alert', (req, res) => {
  const alert = {
    time: new Date().toISOString(),
    ip: req.body.ip || '127.0.0.1',
    endpoint: req.body.endpoint || '/test',
    type: req.body.type || 'TEST',
    signature: req.body.signature || 'manual'
  };
  pushAlert(alert);
  res.json({ ok: true });
});

// Serve public (ids UI)
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, ()=> console.log(`IDS server listening on http://localhost:${PORT}`));

// push recent alerts at startup
const existing = JSON.parse(fs.readFileSync(ALERTS_FILE,'utf8') || '[]').slice(0,20).reverse();
existing.forEach(a => setTimeout(()=> pushAlert(a), 100));
