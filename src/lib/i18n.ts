import { SITE, type Locale } from "@/config/site";

export type { Locale };

export const LOCALES: readonly Locale[] = ["zh", "en"] as const;
export const DEFAULT_LOCALE: Locale = "zh";
export const isLocale = (s: string): s is Locale => (LOCALES as readonly string[]).includes(s);
/** hreflang 值：zh-CN / en（与 guqin-scores 对齐） */
export const hreflang = (l: Locale) => (l === "zh" ? "zh-CN" : "en");
export const otherLocale = (l: Locale): Locale => (l === "zh" ? "en" : "zh");
export const localePath = (l: Locale) => SITE.localePath[l];
export const t = (l: Locale, zh: string, en: string) => (l === "zh" ? zh : en);
/** 保留路径的语言切换（静态站由客户端组件用 usePathname 调用） */
export function swapLocalePath(pathname: string, to: Locale): string {
  const clean = pathname.split(/[?#]/)[0];
  const parts = clean.split("/").filter(Boolean);
  const rest = isLocale(parts[0] ?? "") ? parts.slice(1) : parts;
  const tail = rest.length ? `/${rest.join("/")}${clean.endsWith("/") ? "/" : ""}` : "/";
  return `/${to}${tail}`;
}
