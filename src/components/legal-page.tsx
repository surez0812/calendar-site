import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE, type Locale } from "@/config/site";
import { copy } from "@/lib/copy";
import { legalHtml, type LegalKind } from "@/lib/legal";

/** 法务/支持页：正文来自单一源 Markdown（content/legal/*.md），站点与 App 内 WebView 同源。 */
export function LegalPage({ l, kind }: { l: Locale; kind: LegalKind }) {
  const c = copy(l);
  const title = kind === "privacy" ? c.meta.privacy.title : c.meta.support.title;
  const version = kind === "privacy" ? SITE.legalVersion.privacy : SITE.legalVersion.support;
  return (
    <div className="app-home">
      <SiteHeader l={l} />
      <main id="main" className="legal-wrap">
        <p className="legal-kicker">{c.legal.version} {version}</p>
        <h1>{title}</h1>
        {/* 单一源正文（vendor 自 handover/calendar-20261111/legal/，源 SHA 记于 content/legal/LEGAL_SOURCE.sha256） */}
        <article className="legal-doc" dangerouslySetInnerHTML={{ __html: legalHtml(kind, l) }} />
        <p className="legal-back"><Link href={`/${l}/`} prefetch={false}>{c.legal.back}</Link></p>
      </main>
      <SiteFooter l={l} />
    </div>
  );
}
