#!/usr/bin/env node
/** 本地验收截图：375/1440 × zh/en × light/dark（静态产物 out/ 已构建）。用本机 Chrome，不下载浏览器。 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const ROOT = process.cwd();
const OUTDIR = path.resolve(process.env.SHOT_OUT ?? path.join(ROOT, "../../handover/calendar-20261111/web/shots/v3-d1"));
const PORT = Number(process.env.SHOT_PORT ?? 43127);
const BASE = `http://127.0.0.1:${PORT}`;
fs.mkdirSync(OUTDIR, { recursive: true });

const server = spawn("python3", ["-m", "http.server", String(PORT), "--directory", path.join(ROOT, "out")], { stdio: "ignore" });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
await wait(1200);

const browser = await chromium.launch({ channel: "chrome" });
const shots = [];
try {
  for (const locale of ["zh", "en"]) {
    for (const width of [375, 1440]) {
      for (const scheme of ["light", "dark"]) {
        const ctx = await browser.newContext({ viewport: { width, height: width === 375 ? 812 : 900 }, colorScheme: scheme, deviceScaleFactor: 2 });
        const page = await ctx.newPage();
        const errors = [];
        page.on("console", (m) => {
          if (m.type() !== "error") return;
          const text = m.text();
          // 静态站单线程 http.server 在密集图片请求下偶发连接重置；非页面错误，忽略并在下面用图片加载断言兜底
          if (/ERR_CONNECTION_RESET|ERR_ABORTED/.test(text)) return;
          errors.push(text);
        });
        page.on("pageerror", (e) => errors.push(String(e)));
        await page.goto(`${BASE}/${locale}/`, { waitUntil: "networkidle" });
        // 触发懒加载图片：滚动到底再回顶，并等待所有图片 decode（否则 fullPage 截图里下方设备是空框）
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 400) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 40));
          }
          window.scrollTo(0, 0);
          await Promise.all([...document.images].map((img) => (img.complete ? null : new Promise((r) => { img.onload = r; img.onerror = r; }))));
        });
        // 兜底：所有 <img> 必须真实加载成功（naturalWidth > 0），否则视为缺图
        const broken = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute("src")));
        if (broken.length) errors.push(`broken images: ${broken.join(", ")}`);
        await page.waitForTimeout(300);
        // fullPage 截图时隐藏 fixed 底栏（否则会叠在首屏），底栏单独由 E2E 断言
        await page.addStyleTag({ content: ".bottom-bar{display:none !important}" });
        const file = path.join(OUTDIR, `site-${locale}-${width}-${scheme}.png`);
        await page.screenshot({ path: file, fullPage: true });
        const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
        shots.push({ file: path.basename(file), locale, width, scheme, scrollW, overflow: scrollW > width + 1, errors });
        await ctx.close();
      }
    }
  }
  // 法务页抽样
  for (const p of ["zh/privacy", "en/support"]) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/${p}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(200);
    const file = path.join(OUTDIR, `site-${p.replace("/", "-")}-1440-light.png`);
    await page.screenshot({ path: file, fullPage: true });
    shots.push({ file: path.basename(file), locale: p.replace("/", "-"), width: 1440, scheme: "light", scrollW: 1440, overflow: false, errors: [] });
    await ctx.close();
  }
} finally {
  await browser.close();
  server.kill("SIGTERM");
}
console.log(JSON.stringify(shots, null, 2));
const bad = shots.filter((s) => s.overflow || s.errors.length);
if (bad.length) { console.error(`FAIL: ${bad.length} view(s) had overflow/console errors`); process.exit(1); }
console.log(`OK: ${shots.length} screenshots -> ${OUTDIR}`);
