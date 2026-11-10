import type { Metadata } from "next";
import { SITE, type Locale } from "@/config/site";
import { hreflang, LOCALES } from "./i18n";

/** canonical + hreflang（zh-CN/en + x-default→zh）+ OG/Twitter，路径不带前导斜杠（"" 为首页）。 */
export function pageMeta(l: Locale, path: string, title: string, description: string): Metadata {
  const base = SITE.siteBaseUrl.replace(/\/$/, "");
  const norm = path.replace(/^\/+|\/+$/g, "");
  const url = (loc: Locale) => `${base}/${loc}/${norm ? `${norm}/` : ""}`;
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url(l),
      languages: { ...Object.fromEntries(LOCALES.map((x) => [hreflang(x), url(x)])), "x-default": url("zh") },
    },
    openGraph: {
      type: "website",
      siteName: SITE.productName[l],
      title,
      description,
      url: url(l),
      locale: l === "zh" ? "zh_CN" : "en_US",
      alternateLocale: l === "zh" ? ["en_US"] : ["zh_CN"],
      images: [{ url: `${base}/og/og-${l}.png`, width: 1200, height: 630, alt: SITE.productName[l] }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`${base}/og/og-${l}.png`] },
  };
}
