import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppHome } from "@/components/app/app-home";
import { JsonLd } from "@/components/json-ld";
import { SITE } from "@/config/site";
import { copy } from "@/lib/copy";
import { isLocale, LOCALES } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";

type P = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const c = copy(locale);
  return pageMeta(locale, "", `${c.meta.home.title} - ${SITE.tagline[locale]}`, c.meta.home.description);
}

export default async function Home({ params }: P) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <>
      <JsonLd l={locale} />
      <AppHome l={locale} />
    </>
  );
}
