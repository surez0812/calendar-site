import Link from "next/link";
import { BrandGlyph } from "@/components/brand-glyph";
import { ChromeMenu, LangSwitch } from "@/components/site-header-client";
import type { Locale } from "@/config/site";
import { copy } from "@/lib/copy";
import { hreflang, otherLocale } from "@/lib/i18n";

/** 两行品牌（主字标 + 母品牌副行）+ 桌面 nav + 移动 ChromeMenu（web-header-unify 规格）。 */
export function SiteHeader({ l }: { l: Locale }) {
  const c = copy(l);
  const other = otherLocale(l);
  const links = [
    { href: `/${l}/#features`, text: c.nav.features, testid: "nav-features" },
    { href: `/${l}/#devices`, text: c.nav.devices, testid: "nav-devices" },
    { href: `/${l}/#download`, text: c.nav.download, testid: "nav-download" },
  ];
  return (
    <header className="site-header">
      <div className="wrap">
        <Link className="brand" href={`/${l}/`} prefetch={false} aria-label={`${c.brand.name}，${c.brand.parent}`}>
          <BrandGlyph size={24} />
          <span className="brand-copy">
            <span className="brand-row">
              <span className="brand-main">{c.brand.name}</span>
              <span className="brand-latin">{c.brand.latin}</span>
            </span>
            <span className="brand-parent">{c.brand.parent}</span>
          </span>
        </Link>
        <nav className="nav" aria-label={c.nav.mainNav}>
          {links.map((it) => (
            <Link key={it.href} href={it.href} prefetch={false} data-testid={it.testid}>
              {it.text}
            </Link>
          ))}
          <LangSwitch to={other} hrefLang={hreflang(other)} label={c.langLabel} />
        </nav>
        <ChromeMenu label={c.nav.mainNav} menuLabel={c.nav.menu}>
          {links.map((it) => (
            <Link key={it.href} href={it.href} prefetch={false}>
              {it.text}
            </Link>
          ))}
          <LangSwitch to={other} hrefLang={hreflang(other)} label={c.langLabel} />
        </ChromeMenu>
      </div>
    </header>
  );
}
