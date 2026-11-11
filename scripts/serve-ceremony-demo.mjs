#!/usr/bin/env node
/** P1-7 演示页本地预览服务器：manifest/HTML 强制 no-store（模拟 ops 生产配置） */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.env.DEMO_OUT ?? path.resolve(process.cwd(), "../../handover/calendar-20261111/web/ceremony-demo/out"));
const PORT = Number(process.env.PORT ?? 45871);
const MIME = { ".html": "text/html; charset=utf-8", ".json": "application/json; charset=utf-8", ".css": "text/css", ".svg": "image/svg+xml" };

http.createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  let p = decodeURIComponent(url.pathname);
  if (p === "/" ) p = "/ceremony/";
  let file = path.join(ROOT, p);
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!file.startsWith(ROOT) || !fs.existsSync(file)) { res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }); res.end("404"); return; }
  const ext = path.extname(file);
  res.writeHead(200, {
    "Content-Type": MIME[ext] ?? "application/octet-stream",
    "Cache-Control": "no-store, no-cache, must-revalidate",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "same-origin",
  });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, "127.0.0.1", () => console.log(`ceremony demo -> http://127.0.0.1:${PORT}/ceremony/`));
