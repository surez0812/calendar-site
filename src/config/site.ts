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

/** 可公开素材白名单（PM 2026-11-11）。type: design-mock（标「设计示意」）/ real（真机图）/ hidden（不上站） */
export type ShotType = "design-mock" | "real" | "hidden";
export type PublicShot = { id: string; type: ShotType; note?: string };

export const PUBLIC_SHOTS: readonly PublicShot[] = [
  { id: "month", type: "design-mock", note: "月历主屏" },
  { id: "day", type: "design-mock", note: "日详情（宜忌/冲煞）" },
  { id: "day-b", type: "design-mock", note: "日详情第 2 屏" },
  { id: "anniversary", type: "design-mock", note: "纪念日" },
  { id: "settings", type: "design-mock", note: "设置" },
  // 节日内容页：涉及未解锁内容（剧透）→ 默认 hidden；只允许锁定态且需 PM 单独批准（D8/R17）
  { id: "festivals", type: "hidden" },
  { id: "festival", type: "hidden" },
  { id: "festival-locked", type: "hidden", note: "仅 PM 批准后可改为 design-mock（锁定态）" },
] as const;

export const shotOf = (id: string): PublicShot | undefined => PUBLIC_SHOTS.find((s) => s.id === id);
export const isShotPublic = (id: string): boolean => {
  const s = shotOf(id);
  return !!s && s.type !== "hidden";
};
