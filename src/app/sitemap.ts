import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";
import { hreflang, LOCALES } from "@/lib/i18n";

export const dynamic = "force-static";

/** 3 路径 × 2 locale = 6 条，含 xhtml:link alternates。 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.siteBaseUrl.replace(/\/$/, "");
  const paths = ["", "privacy", "support"];
  return paths.flatMap((p) =>
    LOCALES.map((l) => {
      const suffix = p ? `${p}/` : "";
      return {
        url: `${base}/${l}/${suffix}`,
        alternates: { languages: Object.fromEntries(LOCALES.map((x) => [hreflang(x), `${base}/${x}/${suffix}`])) },
      };
    }),
  );
}
