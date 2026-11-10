import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { SITE } from "@/config/site";
import { copy } from "@/lib/copy";
import { hreflang, isLocale, LOCALES } from "@/lib/i18n";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "zh";
  const c = copy(l);
  return {
    metadataBase: new URL(SITE.siteBaseUrl),
    title: { default: `${c.meta.home.title} - ${SITE.tagline[l]}`, template: `%s - ${SITE.productName[l]}` },
    description: c.meta.home.description,
    applicationName: SITE.productName[l],
    icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }] },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#111112" },
  ],
};

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = copy(locale);
  return (
    <html lang={hreflang(locale)}>
      <body>
        <a className="skip-link" href="#main">{c.nav.skip}</a>
        {children}
      </body>
    </html>
  );
}
