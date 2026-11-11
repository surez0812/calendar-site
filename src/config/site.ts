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
  mainSiteUrl: "https://www.zhaoyao.xin/", // 主站 canonical 域名（含 www）
  supportEmail: "support@zhaoyao.xin",
  /** App 未上架：prelaunch（无 App Store/TestFlight 链接、无假 badge、QR 不放链接） */
  releaseState: "prelaunch" as ReleaseState,
  appStoreAppId: null as string | null,
  /** 视觉方向已定（D1 奶油暖橘，Sure 2026-11-11）→ false；保留开关供回滚/未来改版 */
  visualDirectionPending: false,
  /** Duo 段：目标支持但 v1 不宣称 → A13 通过 + PM 开开关后才 true（D13） */
  showDuo: true, // PROPOSAL prototype（A13 前仅写「为 iPhone Duo 设计」，不写「已支持折叠屏」）
  /** 结构化数据：prelaunch 只发 Organization + WebSite；live 后才加 SoftwareApplication（D11） */
  jsonLd: { organization: true, website: true, softwareApplication: false },
  legalVersion: { privacy: "prelaunch-0.3", support: "prelaunch-0.6" }, // 与 legal 源一致（privacy v0.3 / support v0.6）
} as const;

export const isLive = (): boolean => SITE.releaseState === "live" && !!SITE.appStoreAppId;

/** SEO title 模板：{productName} - {tagline}（PM 2026-11-11；不把中文名硬编码进 metadata 字符串） */
export function titleFor(l: Locale, suffix?: string): string {
  return suffix ? `${suffix} - ${SITE.productName[l]}` : `${SITE.productName[l]} - ${SITE.tagline[l]}`;
}

/**
 * 素材登记表（v3：D1「奶油暖橘」已定稿，Sure 2026-11-11）。
 * 唯一参照：handover/calendar-20261111/design/final/D1-apricot/（README + spec/tokens-web-v1.css）。
 * 上站白名单以 PM 口径为准：`phone-festivals` / `phone-locked` / `phone-unlocked` 属节日内容 → hidden（防剧透）。
 * Duo 素材 D1 已交付但 **A13 前不进官网**（EXCLUDED_ASSETS.duo）。
 */
export type ShotKind = "phone" | "ipad" | "desktop" | "duo";
export type ShotType = "design-mock" | "real" | "hidden" | "reference";
export type ShotAsset = {
  key: string;
  /** D1 源文件名（默认 = key；`phone-day-b` 用 D1 的 phone-compass 画面，保持组件映射零改动） */
  file: string;
  kind: ShotKind;
  type: ShotType;
  available: { light: boolean; dark: boolean };
  widths: readonly number[];
  w: number;
  h: number;
  note?: string;
};

/**
 * 素材登记表（v3：D1「奶油暖橘」定稿，Sure 2026-11-11）。
 * 唯一参照：handover/calendar-20261111/design/final/D1-apricot/。
 * 组件对 key 的映射保持 v2.1 不变（month/day/day-b/anniversary/settings），只换底层 D1 文件 → 组件 diff=0。
 * 节日内容（festivals/locked/unlocked）hidden 防剧透；Duo 素材 A13 前不进官网。
 */
export const PUBLIC_SHOTS: readonly ShotAsset[] = [
  { key: "phone-month", file: "phone-month", kind: "phone", type: "design-mock", available: { light: true, dark: true }, widths: [375, 750], w: 375, h: 812, note: "月历主屏（D1）" },
  { key: "phone-day", file: "phone-day", kind: "phone", type: "design-mock", available: { light: true, dark: true }, widths: [375, 750], w: 375, h: 812, note: "日详情（D1）" },
  { key: "phone-day-b", file: "phone-compass", kind: "phone", type: "design-mock", available: { light: true, dark: true }, widths: [375, 750], w: 375, h: 812, note: "日详情第 2 屏 → D1 吉神罗盘" },
  { key: "phone-anniversary", file: "phone-anniversary", kind: "phone", type: "design-mock", available: { light: true, dark: true }, widths: [375, 750], w: 375, h: 812, note: "倒计日（D1）" },
  { key: "phone-settings", file: "phone-settings", kind: "phone", type: "design-mock", available: { light: true, dark: true }, widths: [375, 750], w: 375, h: 812, note: "设置（D1）" },
  { key: "ipad", file: "ipad", kind: "ipad", type: "design-mock", available: { light: true, dark: true }, widths: [683, 1366], w: 683, h: 512, note: "iPad 双栏（D1；本轮不接线，保留）" },
  // PROPOSAL · iPhone Duo 四姿态（D1 素材；仅当 showDuo=true 时渲染）
  { key: "duo-outer", file: "duo-outer", kind: "duo", type: "design-mock", available: { light: true, dark: true }, widths: [466, 932], w: 466, h: 678, note: "Duo 外屏" },
  { key: "duo-open", file: "duo-open", kind: "duo", type: "design-mock", available: { light: true, dark: true }, widths: [951, 1902], w: 951, h: 669, note: "Duo 展开（双栏）" },
  { key: "duo-tabletop", file: "duo-tabletop", kind: "duo", type: "design-mock", available: { light: true, dark: true }, widths: [669, 1338], w: 669, h: 951, note: "Duo tabletop" },
  { key: "duo-tent", file: "duo-tent", kind: "duo", type: "design-mock", available: { light: true, dark: true }, widths: [951, 1902], w: 951, h: 669, note: "Duo tent" },
  { key: "web-home-1440", file: "web-home-1440", kind: "desktop", type: "reference", available: { light: true, dark: true }, widths: [1440], w: 1440, h: 4950, note: "官网 1440 设计参考（不上公开页）" },
  { key: "phone-festivals", file: "phone-festivals", kind: "phone", type: "hidden", available: { light: true, dark: true }, widths: [], w: 375, h: 812 },
  { key: "phone-locked", file: "phone-locked", kind: "phone", type: "hidden", available: { light: true, dark: true }, widths: [], w: 375, h: 812 },
  { key: "phone-unlocked", file: "phone-unlocked", kind: "phone", type: "hidden", available: { light: true, dark: true }, widths: [], w: 375, h: 812 },
] as const;

/** 站点不接的素材：Duo A13 前不露出；OG/品牌 mark 待 Sure 批 mark。 */
export const EXCLUDED_ASSETS = {
  duo: "A13 前不进官网（D1 已交付 duo-* 素材但站点不渲染）",
  og: "public/og/og-{zh,en}.png（待 mark 批后出）",
  brand: "public/brand/lixiang-mark-{light,dark}.svg（待 mark 批后出）",
} as const;

export const shotOf = (key: string): ShotAsset | undefined => PUBLIC_SHOTS.find((s) => s.key === key);
/** 是否可上公开页：hidden/reference/pending 都不可；具体文件是否已交付由 lib/shots.ts 判断。 */
export const isShotRendered = (key: string): boolean => {
  const s = shotOf(key);
  return !!s && (s.type === "design-mock" || s.type === "real");
};
