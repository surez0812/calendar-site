/**
 * 站点单一配置源（PLAN §4 / SCAFFOLD §3）。任何命名/开关/链接/文案级变更只改这里。
 * Sure 定稿 2026-11-11：产品名 历象 / Lixiang Almanac；域名 lixiang.zhaoyao.xin。
 */
export type Locale = "zh" | "en";
export type ReleaseState = "prelaunch" | "live";

export const SITE = {
  productName: { zh: "历象", en: "Lixiang Almanac" } as Record<Locale, string>,
  productNameEn: "Lixiang Almanac",
  /** PM 2026-11-11 建议：zh「一本干净的中国万年历」/ en「A clean Chinese almanac」 */
  tagline: { zh: "一本干净的中国万年历", en: "A clean Chinese almanac" } as Record<Locale, string>,
  localePath: { zh: "/zh", en: "/en" } as Record<Locale, string>,
  /** 生产基址；构建时可用 SITE_BASE_URL 覆盖（本地预览用 http://127.0.0.1:PORT） */
  siteBaseUrl: process.env.SITE_BASE_URL ?? "https://lixiang.zhaoyao.xin",
  mainSiteUrl: "https://zhaoyao.xin/",
  supportEmail: "support@zhaoyao.xin",
  /** App 未上架：prelaunch（无 App Store/TestFlight 链接、无假 badge、QR 不放链接） */
  releaseState: "prelaunch" as ReleaseState,
  appStoreAppId: null as string | null,
  /**
   * 视觉方向待定（Sure 2026-11-11 否决「原纸墨稿」；A 天象星历 / B 节气色谱 / C 器物木刻 三选一未定）。
   * true 时页面顶部渲染「临时占位」提示条；designer 交付 tokens-web-v1.css + 签字 mockup 后改 false。
   */
  visualDirectionPending: true,
  /** Duo 段：目标支持但 v1 不宣称 → A13 通过 + PM 开开关后才 true（D13） */
  showDuo: false,
  /** 结构化数据：prelaunch 只发 Organization + WebSite；live 后才加 SoftwareApplication（D11） */
  jsonLd: { organization: true, website: true, softwareApplication: false },
  legalVersion: { privacy: "prelaunch-0.1", support: "prelaunch-0.1" },
} as const;

export const isLive = (): boolean => SITE.releaseState === "live" && !!SITE.appStoreAppId;

/** SEO title 模板：{productName} - {tagline}（PM 2026-11-11；不把中文名硬编码进 metadata 字符串） */
export function titleFor(l: Locale, suffix?: string): string {
  return suffix ? `${suffix} - ${SITE.productName[l]}` : `${SITE.productName[l]} - ${SITE.tagline[l]}`;
}

/**
 * 素材登记表（**预接线**：key 已按 designer `design/directions/README.md` 命名约定固定；值先全 null）。
 * 方向选定后：只补文件 + 改 `type`（design-mock → real），结构/渲染代码不变；**Duo 不进官网**（A13 前不露出）。
 * 命名约定（designer 2026-11-11）：
 *   phone-{month,day,day-b,anniversary,settings}{,-dark}.png（375×812 @2x）→ /mockups/{key}-{theme}-{375,750}.webp
 *   ipad{,-dark}.png（1366×1024）      → /mockups/ipad-{theme}-{683,1366}.webp
 *   web-home-1440{,-dark}.png（1440 宽整页）→ 设计参考位（reference，不上公开页）
 *   og-{zh,en}.png / brand/lixiang-mark-{light,dark}.svg → 见 ASSET_NOTES
 *   festival* 永远 hidden（防剧透，与视觉方向无关）
 */
export type ShotKind = "phone" | "ipad" | "desktop";
export type ShotType = "pending" | "design-mock" | "real" | "hidden" | "reference";
export type ShotAsset = {
  key: string;
  kind: ShotKind;
  type: ShotType;
  /** 两主题文件是否已交付；null = 未交付（预接线状态） */
  src: { light: string | null; dark: string | null };
  widths: readonly number[];
  w: number;
  h: number;
  note?: string;
};

export const PUBLIC_SHOTS: readonly ShotAsset[] = [
  { key: "phone-month", kind: "phone", type: "pending", src: { light: null, dark: null }, widths: [375, 750], w: 375, h: 812, note: "月历主屏" },
  { key: "phone-day", kind: "phone", type: "pending", src: { light: null, dark: null }, widths: [375, 750], w: 375, h: 812, note: "日详情" },
  { key: "phone-day-b", kind: "phone", type: "pending", src: { light: null, dark: null }, widths: [375, 750], w: 375, h: 812, note: "日详情第 2 屏" },
  { key: "phone-anniversary", kind: "phone", type: "pending", src: { light: null, dark: null }, widths: [375, 750], w: 375, h: 812, note: "纪念日" },
  { key: "phone-settings", kind: "phone", type: "pending", src: { light: null, dark: null }, widths: [375, 750], w: 375, h: 812, note: "设置" },
  { key: "ipad", kind: "ipad", type: "pending", src: { light: null, dark: null }, widths: [683, 1366], w: 683, h: 512, note: "iPad 1366×1024" },
  { key: "web-home-1440", kind: "desktop", type: "reference", src: { light: null, dark: null }, widths: [1440], w: 1440, h: 4950, note: "官网 1440 设计参考（不上公开页）" },
  // 节日内容页：涉及未解锁内容（剧透）→ 永远 hidden；只允许锁定态且需 PM 单独批准（D8/R17）
  { key: "festivals", kind: "phone", type: "hidden", src: { light: null, dark: null }, widths: [], w: 375, h: 812 },
  { key: "festival", kind: "phone", type: "hidden", src: { light: null, dark: null }, widths: [], w: 375, h: 812 },
  { key: "festival-locked", kind: "phone", type: "hidden", src: { light: null, dark: null }, widths: [], w: 375, h: 812, note: "仅 PM 批准后可改为 design-mock（锁定态）" },
] as const;

/** 站点不接的素材（显式登记，避免误加）：Duo A13 前不露出；OG/品牌 mark 走 public/ 静态文件而非截图管线。 */
export const EXCLUDED_ASSETS = { duo: "A13 前不进官网", og: "public/og/og-{zh,en}.png", brand: "public/brand/lixiang-mark-{light,dark}.svg" } as const;

export const shotOf = (key: string): ShotAsset | undefined => PUBLIC_SHOTS.find((s) => s.key === key);
/** 是否可上公开页：hidden/reference/pending 都不可；具体文件是否已交付由 lib/shots.ts 判断。 */
export const isShotRendered = (key: string): boolean => {
  const s = shotOf(key);
  return !!s && (s.type === "design-mock" || s.type === "real");
};
