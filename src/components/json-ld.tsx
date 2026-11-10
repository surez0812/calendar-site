import { SITE, isLive, type Locale } from "@/config/site";

/** prelaunch：只发 Organization + WebSite；live 且开关打开才发 SoftwareApplication（D11）。 */
export function JsonLd({ l }: { l: Locale }) {
  const base = SITE.siteBaseUrl.replace(/\/$/, "");
  const graph: Record<string, unknown>[] = [];
  if (SITE.jsonLd.organization) {
    graph.push({
      "@type": "Organization",
      "@id": `${base}/#org`,
      name: SITE.productName[l],
      url: `${base}/${l}/`,
      email: SITE.supportEmail,
      parentOrganization: { "@type": "Organization", name: "昭杳", url: SITE.mainSiteUrl },
    });
  }
  if (SITE.jsonLd.website) {
    graph.push({
      "@type": "WebSite",
      "@id": `${base}/#website`,
      name: SITE.productName[l],
      url: `${base}/${l}/`,
      inLanguage: l === "zh" ? "zh-CN" : "en",
      publisher: { "@id": `${base}/#org` },
    });
  }
  if (SITE.jsonLd.softwareApplication && isLive()) {
    graph.push({
      "@type": "SoftwareApplication",
      name: SITE.productName[l],
      operatingSystem: "iOS 17+",
      applicationCategory: "LifestyleApplication",
      offers: { "@type": "Offer", price: "0", priceCurrency: "CNY" },
      installUrl: `https://apps.apple.com/app/id${SITE.appStoreAppId}`,
    });
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }} />;
}
