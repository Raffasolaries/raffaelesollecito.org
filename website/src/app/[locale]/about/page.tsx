import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/Section";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, breadcrumbLd, localizedUrl, PERSON_ID } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.about" });
  return pageMetadata({ locale, path: "about/", title: t("title"), description: t("description"), image: "/images/raffaele-1.jpg", type: "profile" });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tn = await getTranslations("nav");

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "ProfilePage", "@id": localizedUrl(locale, "about/") + "#page", mainEntity: { "@id": PERSON_ID }, inLanguage: locale, dateModified: "2026-09-04" },
      breadcrumbLd(locale, tn("home"), tn("about"), "about/"),
    ],
  };

  return (
    <>
      <JsonLd data={ld} />
      <Section className="pt-32">
        <SectionHeader title={t("title")} headline={t("headline")} />

        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3 space-y-6">
            <p className="text-lg leading-relaxed">{t("bio_intro")}</p>
            <p className="text-muted leading-relaxed">{t("bio_current")}</p>
            <p className="text-muted leading-relaxed">{t("bio_personal")}</p>

            <aside className="mt-8 rounded-lg border border-border/60 bg-surface p-6">
              <h2 className="text-sm font-mono uppercase tracking-widest text-accent">{t("case_title")}</h2>
              <p className="mt-3 text-muted leading-relaxed">{t("case_text")}</p>
              <Link href={`/${locale}/case/`} className="mt-4 inline-flex items-center text-accent hover:text-accent-light font-medium">
                {t("case_link")} →
              </Link>
            </aside>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="relative">
              <div className="absolute -inset-2 bg-accent/10 rounded-lg blur-xl" aria-hidden="true" />
              <img
                src="/images/raffaele-1.jpg"
                alt="Raffaele Sollecito"
                width={960}
                height={960}
                className="relative w-full rounded-lg border border-border/50 object-cover aspect-[4/5]"
              />
            </div>
            <div className="bg-surface border border-border/50 rounded-lg p-6 space-y-4">
              {(["years", "certs", "clients", "countries"] as const).map((key) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-muted text-sm">{t(`stats.${key}_label`)}</span>
                  <span className="text-2xl font-bold text-accent">{t(`stats.${key}`)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* How I work */}
      <Section className="bg-surface/30">
        <h2 className="text-2xl font-bold mb-8">{t("values_title")}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {(["ownership", "evidence", "governance"] as const).map((k) => (
            <div key={k} className="p-6 bg-surface rounded-lg border border-border/50">
              <h3 className="font-semibold text-lg">{t(`values.${k}.title`)}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">{t(`values.${k}.text`)}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Gallery */}
      <Section className="!py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { src: "/images/raffaele-2.jpg", alt: "Raffaele Sollecito", w: 509, h: 521 },
            { src: "/images/raffaele-3.jpg", alt: "Raffaele Sollecito — interview", w: 2560, h: 1706 },
            { src: "/images/raffaele-4.jpg", alt: "Raffaele Sollecito", w: 1152, h: 2048 },
          ].map((photo) => (
            <div key={photo.src} className="overflow-hidden rounded-lg border border-border/50">
              <img
                src={photo.src}
                alt={photo.alt}
                width={photo.w}
                height={photo.h}
                loading="lazy"
                className="w-full aspect-[4/5] object-cover object-top hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Personal */}
      <Section className="bg-surface/30">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold mb-6">{t("personal_title")}</h2>
          <p className="text-muted leading-relaxed text-lg">{t("personal_text")}</p>
        </div>
      </Section>

      {/* Education */}
      <Section>
        <h2 className="text-2xl font-bold mb-8">{t("education_title")}</h2>
        <div className="space-y-6">
          {(["verona", "perugia", "camerino"] as const).map((k) => (
            <div key={k} className="flex gap-4">
              <div className="w-2 h-2 mt-2.5 rounded-full bg-accent shrink-0" aria-hidden="true" />
              <div>
                <h3 className="font-semibold">{t(`education.${k}.school`)}</h3>
                <p className="text-muted text-sm">
                  {t(`education.${k}.degree`)} · {t(`education.${k}.period`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
