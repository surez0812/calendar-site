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
// 视觉方向待定（Sure 2026-11-11 否决旧纸墨稿）：默认不生成旧方向 mockup。
// 拿到 designer 签字版新素材后：BUILD_MOCKUPS=1 pnpm assets，并把对应 shot 的 type 改 real/design-mock。
const BUILD_MOCKUPS = process.env.BUILD_MOCKUPS === "1";
if (!BUILD_MOCKUPS) console.log("skip mockups: visual direction pending (set BUILD_MOCKUPS=1 only after designer signs the new direction)");
// key = designer 命名约定（见 src/config/site.ts）；file 名去掉 phone- 前缀
const DEFAULT_KEYS = ["phone-month", "phone-day", "phone-day-b", "phone-anniversary", "phone-settings", "ipad", "duo-outer", "duo-open", "duo-tabletop", "duo-tent"]; // D1 白名单 + Duo 四姿态（节日/锁定/解锁 = hidden，不生成）
/** key → D1 源文件基名（保持组件映射不变） */
const FILE_OF = { "phone-day-b": "phone-compass" };
const IDS = process.env.MOCKUP_IDS ? process.env.MOCKUP_IDS.split(",") : DEFAULT_KEYS;
const designFile = (key, theme) => {
  const base = FILE_OF[key] ?? key;
  return theme === "light" ? `${base}.png` : `${base}-dark.png`;
};
const widthsFor = (key) => (key === "ipad" ? [683, 1366] : key === "duo-outer" ? [466, 932] : key === "duo-tabletop" ? [669, 1338] : key.startsWith("duo-") ? [951, 1902] : [375, 750]);
const THEMES = ["light", "dark"];

if (BUILD_MOCKUPS) fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(OG, { recursive: true });

let n = 0;
for (const id of BUILD_MOCKUPS ? IDS : []) {
  for (const theme of THEMES) {
    const file = designFile(id, theme);
    const src = path.join(SRC, file);
    if (!fs.existsSync(src)) { console.warn(`WARN missing ${src}`); continue; }
    for (const w of widthsFor(id)) {
      const outName = FILE_OF[id] ?? id;
      const out = path.join(OUT, `${outName}-${theme}-${w}.webp`);
      await sharp(src).resize({ width: w }).webp({ quality: 82 }).toFile(out);
      n++;
    }
  }
}
if (BUILD_MOCKUPS) console.log(`mockups: ${n} webp written`);

// ---- OG 占位（1200×630，designer 定稿后替换）----
const ogSvg = (title, sub) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#FBF5EC"/>
  <rect x="56" y="56" width="1088" height="518" fill="none" stroke="#DCD2C0" stroke-width="2"/>
  <text x="600" y="300" text-anchor="middle" font-family="-apple-system, PingFang SC, sans-serif" font-size="92" font-weight="700" fill="#3A3028">${title}</text>
  <text x="600" y="378" text-anchor="middle" font-family="PingFang SC, Noto Sans SC, sans-serif" font-size="34" fill="#7A6A5C">${sub}</text>
  <text x="600" y="520" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="22" letter-spacing="6" fill="#C97B5A">LIXIANG ALMANAC</text>
</svg>`;
const OGS = [
  { file: "og-zh.png", svg: ogSvg("历象", "一本干净的中国万年历") },
  { file: "og-en.png", svg: ogSvg("Lixiang Almanac", "A clean Chinese almanac") },
];
for (const o of OGS) {
  await sharp(Buffer.from(o.svg)).png().toFile(path.join(OG, o.file));
  console.log(`og: ${o.file}`);
}

if (BUILD_MOCKUPS) {
  const total = fs.readdirSync(OUT).reduce((sum, f) => sum + fs.statSync(path.join(OUT, f)).size, 0);
  console.log(`public/mockups size: ${(total / 1024 / 1024).toFixed(2)} MiB`);
}
