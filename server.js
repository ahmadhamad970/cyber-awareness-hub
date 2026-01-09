// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import dns from "dns/promises";
import https from "https";
import { fileURLToPath } from "url";
import createIDS from "./ids-middleware.mjs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File for IDS alerts
const ALERTS_FILE = path.join(__dirname, "ids-alerts.json");
if (!fs.existsSync(ALERTS_FILE)) fs.writeFileSync(ALERTS_FILE, "[]", "utf8");

const app = express();
app.set("trust proxy", false);

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  keepAlive: true
});

/* ------------------------- Helpers ---------------------------- */

// Health check endpoint for Render
app.get("/", (req, res) => {
  res.json({ 
    status: "ok", 
    service: "Cyber Awareness Hub API",
    timestamp: new Date().toISOString()
  });
});

function readAlerts() {
  try {
    return JSON.parse(fs.readFileSync(ALERTS_FILE, "utf8") || "[]");
  } catch {
    return [];
  }
}

function writeAlerts(arr) {
  fs.writeFileSync(ALERTS_FILE, JSON.stringify(arr, null, 2), "utf8");
}

const sseClients = new Set();
function broadcastEvent(obj) {
  const msg = JSON.stringify(obj);
  for (const client of sseClients) {
    try { client.write(`data: ${msg}\n\n`); } catch {}
  }
}

/* ------------------------- IDS Middleware ---------------------------- */

const ids = createIDS({ blockOnDetect: false, skipLocal: true });

app.use((req, res, next) => {
  if (
    req.path.startsWith("/events") ||
    req.path.startsWith("/alerts-api") ||
    req.path.startsWith("/ids-scan") ||
    req.path.startsWith("/log-attack") ||
    req.path.startsWith("/api/scan")
  ) return next();

  return ids(req, res, next);
});

/* ------------------------- SSE (Live IDS Events) ---------------------------- */

app.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const latest = readAlerts()[0] || null;
  if (latest) res.write(`data: ${JSON.stringify(latest)}\n\n`);

  sseClients.add(res);
  req.on("close", () => sseClients.delete(res));
});

/* ------------------------- IDS Scan API ---------------------------- */

app.post("/ids-scan", async (req, res) => {
  try {
    let { url } = req.body;
    if (!url) return res.status(400).json({ error: "Missing url" });

    // normalize URL
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;

    const parsed = new URL(url);
    const hostname = parsed.hostname;

    /* 1 — DNS Lookup */
    let resolved_ip = null;
    try {
      const dnsRes = await dns.lookup(hostname);
      resolved_ip = dnsRes.address;
    } catch {}

    /* 2 — Fetch headers + status */
    let statusCode = null;
    let serverHeader = "Unknown";

    try {
      const fetched = await fetch(parsed.href, { agent: httpsAgent });
      statusCode = fetched.status;
      serverHeader = fetched.headers.get("server") || "Unknown";
    } catch {
      statusCode = "Connection failed";
      serverHeader = "Unknown";
    }

    /* 3 — GEOIP Lookup */
    let geo = null;
    if (resolved_ip) {
      try {
        const geoReq = await fetch(`https://ipapi.co/${resolved_ip}/json/`);
        const g = await geoReq.json();

        geo = {
          latitude: g.latitude,
          longitude: g.longitude,
          country: g.country_name,
          city: g.city
        };
      } catch {}
    }

    /* return clean structured data */
    res.json({
      target: parsed.href,
      indicators: {
        status: statusCode,
        server: serverHeader,
        resolved_ip
      },
      geo
    });

  } catch (err) {
    res.status(500).json({ error: "IDS scan failed", details: err.message });
  }
});

/* ------------------------- IDS Stats APIs ---------------------------- */

app.get("/alerts-api/last50", (req, res) => {
  res.json(readAlerts().slice(0, 50));
});

app.post("/log-attack", (req, res) => {
  const alert = {
    time: new Date().toISOString(),
    ip: req.ip,
    endpoint: req.body.endpoint || "/",
    type: req.body.type || "Simulated Attack"
  };

  const arr = readAlerts();
  arr.unshift(alert);
  writeAlerts(arr);
  broadcastEvent(alert);

  res.json({ ok: true, alert });
});

/* ------------------------- VirusTotal URL Scan ---------------------------- */

app.post("/api/scan", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    const apiKey = process.env.VT_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "VirusTotal API key missing in .env" });

    // submit url
    const submitRes = await fetch("https://www.virustotal.com/api/v3/urls", {
      method: "POST",
      headers: { "x-apikey": apiKey, "Content-Type": "application/x-www-form-urlencoded" },
      body: `url=${encodeURIComponent(url)}`
    });

    const subJson = await submitRes.json();
    const analysisId = subJson?.data?.id;

    if (!analysisId) return res.status(500).json({ error: "Failed to submit URL" });

    // get full result
    const reportRes = await fetch(
      `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
      { headers: { "x-apikey": apiKey } }
    );

    const reportJson = await reportRes.json();
    res.json(reportJson);

  } catch (err) {
    res.status(500).json({ error: "VirusTotal scan failed", details: err.message });
  }
});

/* ------------------------- Start Server ---------------------------- */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(` Server running on port ${PORT}`)
);
