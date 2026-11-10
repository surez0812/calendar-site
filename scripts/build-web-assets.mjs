#!/usr/bin/env node
/** 素材管线：designer 375@2x mockup PNG → 站点 1x/2x WebP（只处理 publicShots 白名单内、非 hidden 的素材）。
 *  PNG 原图不进仓库；OG 图在 designer 交付前生成中性占位（不冒充设计稿）。 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC = path.resolve(process.env.MOCKUP_SRC ?? path.join(ROOT, "../../handover/calendar-20261111/design/mockups"));
const OUT = path.join(ROOT, "public", "mockups");
const OG = path.join(ROOT, "public", "og");
const IDS = ["month", "day", "day-b", "anniversary", "settings"]; // = publicShots 中非 hidden 项
const THEMES = ["light", "dark"];
const WIDTHS = [375, 750];

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(OG, { recursive: true });

let n = 0;
for (const id of IDS) {
  for (const theme of THEMES) {
    const file = theme === "light" ? `phone-${id}.png` : `phone-${id}-dark.png`;
    const src = path.join(SRC, file);
    if (!fs.existsSync(src)) { console.warn(`WARN missing ${src}`); continue; }
    for (const w of WIDTHS) {
      const out = path.join(OUT, `${id}-${theme}-${w}.webp`);
      await sharp(src).resize({ width: w }).webp({ quality: 82 }).toFile(out);
      n++;
    }
  }
}
console.log(`mockups: ${n} webp written`);

// ---- OG 占位（1200×630，designer 定稿后替换）----
const ogSvg = (title, sub) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#F4F0E6"/>
  <rect x="56" y="56" width="1088" height="518" fill="none" stroke="#DCD2C0" stroke-width="2"/>
  <text x="600" y="300" text-anchor="middle" font-family="Songti SC, Noto Serif SC, serif" font-size="96" font-weight="700" fill="#1B1915">${title}</text>
  <text x="600" y="378" text-anchor="middle" font-family="PingFang SC, Noto Sans SC, sans-serif" font-size="34" fill="#5C574C">${sub}</text>
  <text x="600" y="520" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="24" letter-spacing="6" fill="#B8321F">LIXIANG ALMANAC</text>
</svg>`;
const OGS = [
  { file: "og-zh.png", svg: ogSvg("历象", "一本干净的中国万年历") },
  { file: "og-en.png", svg: ogSvg("Lixiang Almanac", "A clean Chinese almanac") },
];
for (const o of OGS) {
  await sharp(Buffer.from(o.svg)).png().toFile(path.join(OG, o.file));
  console.log(`og: ${o.file}`);
}

const total = fs.readdirSync(OUT).reduce((sum, f) => sum + fs.statSync(path.join(OUT, f)).size, 0);
console.log(`public/mockups size: ${(total / 1024 / 1024).toFixed(2)} MiB`);
