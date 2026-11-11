import Link from "next/link";
import { BrandGlyph } from "@/components/brand-glyph";
import { SITE, type Locale } from "@/config/site";
import { SITE_BEIAN } from "@/lib/beian";
import { copy } from "@/lib/copy";
import { hreflang, otherLocale } from "@/lib/i18n";
import { LangSwitch } from "@/components/site-header-client";

export function SiteFooter({ l }: { l: Locale }) {
  const c = copy(l);
  const other = otherLocale(l);
  const { icp, gongan } = SITE_BEIAN;
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <p className="foot-brand"><BrandGlyph size={19} /><span>{c.brand.name}</span></p>
            <p className="foot-line">{c.footer.brandLine}</p>
            <p className="foot-line">{c.footer.source}</p>
          </div>
          <nav aria-label={c.footer.cols.product}>
            <p className="foot-h">{c.footer.cols.product}</p>
            <Link href={`/${l}/#features`} prefetch={false}>{c.footer.features}</Link>
            <Link href={`/${l}/#devices`} prefetch={false}>{c.footer.devices}</Link>
            <Link href={`/${l}/#download`} prefetch={false}>{c.footer.download}</Link>
          </nav>
          <nav aria-label={c.footer.cols.support}>
            <p className="foot-h">{c.footer.cols.support}</p>
            <Link href={`/${l}/support/`} prefetch={false}>{c.footer.supportLink}</Link>
            <Link href={`/${l}/privacy/`} prefetch={false}>{c.footer.privacy}</Link>
            <Link href={`/${l}/terms/`} prefetch={false}>{c.footer.termsLink}</Link>
            <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>
          </nav>
          <nav aria-label={c.footer.cols.parent}>
            <p className="foot-h">{c.footer.cols.parent}</p>
            <a href={SITE.mainSiteUrl} target="_blank" rel="noopener noreferrer">{c.footer.mainSite} ↗</a>
          </nav>
        </div>
        <div className="foot-bottom">
          <span>{c.footer.operator}</span>
          <LangSwitch to={other} hrefLang={hreflang(other)} label={c.langLabel} />
          <span className="beian">
            <a href={icp.href} target="_blank" rel="noopener noreferrer">{icp.number}</a>
            <a href={gongan.href} target="_blank" rel="noopener noreferrer">{gongan.number}</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
