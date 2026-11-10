import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/legal-page";
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
  return pageMeta(locale, "privacy", `${c.meta.privacy.title} - ${SITE.productName[locale]}`, c.meta.privacy.description);
}
export default async function Privacy({ params }: P) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <LegalPage l={locale} kind="privacy" />;
}
