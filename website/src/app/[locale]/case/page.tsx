import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/Section";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, breadcrumbLd, localizedUrl, PERSON_ID } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.case" });
  return pageMetadata({ locale, path: "case/", title: t("title"), description: t("description"), type: "article" });
}

const TIMELINE = ["t2007", "t2009", "t2011", "t2013", "t2014", "t2015"] as const;
const FAQ = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8"] as const;

export default async function CasePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("case");
  const tn = await getTranslations("nav");
  const tseo = await getTranslations("seo.case");

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": localizedUrl(locale, "case/") + "#article",
        headline: t("headline"),
        description: tseo("description"),
        inLanguage: locale,
        author: { "@id": PERSON_ID },
        publisher: { "@id": PERSON_ID },
        about: { "@id": PERSON_ID },
        mainEntityOfPage: localizedUrl(locale, "case/"),
        dateModified: "2026-09-04",
      },
      {
        "@type": "FAQPage",
        "@id": localizedUrl(locale, "case/") + "#faq",
        mainEntity: FAQ.map((k) => ({
          "@type": "Question",
          name: t(`faq.${k}.q`),
          acceptedAnswer: { "@type": "Answer", text: t(`faq.${k}.a`) },
        })),
      },
      breadcrumbLd(locale, tn("home"), tn("case"), "case/"),
    ],
  };

  return (
    <>
      <JsonLd data={ld} />

      <Section className="pt-32 speed-lines mandala">
        <SectionHeader title={t("title")} headline={t("headline")} />
        <div className="max-w-3xl space-y-6">
          <p className="text-lg sm:text-xl leading-relaxed">{t("lede")}</p>
          <p className="text-muted leading-relaxed border-l-2 border-border pl-5">{t("respect")}</p>
        </div>
      </Section>

      {/* Timeline */}
      <Section className="bg-surface/30">
        <h2 className="text-2xl font-bold mb-10">{t("sections.timeline")}</h2>
        <ol className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-crimson via-accent to-transparent" aria-hidden="true" />
          <div className="space-y-8">
            {TIMELINE.map((k, i) => (
              <li key={k} className="relative pl-12">
                <div
                  className={`absolute left-4 top-1.5 w-3 h-3 rounded-full -translate-x-[5px] ${
                    i === TIMELINE.length - 1 ? "bg-accent border-2 border-accent glow-accent" : "bg-background border-2 border-crimson"
                  }`}
                  aria-hidden="true"
                />
                <time className="text-sm font-mono text-accent">{t(`timeline.${k}.date`)}</time>
                <p className="mt-1 text-foreground max-w-3xl leading-relaxed">{t(`timeline.${k}.text`)}</p>
              </li>
            ))}
          </div>
        </ol>
      </Section>

      {/* FAQ */}
      <Section>
        <h2 className="text-2xl font-bold mb-10">{t("sections.faq")}</h2>
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 max-w-5xl">
          {FAQ.map((k) => (
            <div key={k}>
              <h3 className="font-semibold text-lg">{t(`faq.${k}.q`)}</h3>
              <p className="mt-2 text-muted leading-relaxed">{t(`faq.${k}.a`)}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Documents + Books */}
      <Section className="bg-surface/30 !py-16">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-surface border border-border/50 rounded-lg p-8">
            <h3 className="text-xl font-bold mb-3">{t("sections.documents")}</h3>
            <p className="text-muted mb-6">{t("documents_text")}</p>
            <Link href={`/${locale}/documents/`} className="inline-flex items-center px-5 py-2.5 bg-accent hover:bg-accent-light text-white font-medium rounded-md transition-all">
              {t("documents_cta")} →
            </Link>
          </div>
          <div className="bg-surface border border-border/50 rounded-lg p-8">
            <h3 className="text-xl font-bold mb-3">{t("sections.books")}</h3>
            <p className="text-muted mb-6">{t("books_text")}</p>
            <Link href={`/${locale}/books/`} className="inline-flex items-center px-5 py-2.5 border border-border hover:border-crimson/50 font-medium rounded-md transition-all">
              {t("books_cta")} →
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
