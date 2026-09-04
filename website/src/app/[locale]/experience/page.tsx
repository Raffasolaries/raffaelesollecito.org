import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section, SectionHeader } from "@/components/Section";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, breadcrumbLd, RESUME_URL } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.experience" });
  return pageMetadata({ locale, path: "experience/", title: t("title"), description: t("description") });
}

const positionKeys = [
  "aspect",
  "pwc",
  "vw",
  "itnet",
  "tantosvago",
  "keypartner",
  "memories",
] as const;

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("experience");
  const tn = await getTranslations("nav");

  return (
    <Section className="pt-32">
      <JsonLd data={breadcrumbLd(locale, tn("home"), tn("experience"), "experience/")} />
      <SectionHeader
        title={t("title")}
        headline={t("headline")}
        subtitle={t("subtitle")}
      />

      <a
        href={RESUME_URL}
        className="-mt-8 mb-12 inline-flex items-center gap-2 px-5 py-2.5 border border-border hover:border-accent/50 rounded-md text-sm font-medium transition-colors"
      >
        <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" /></svg>
        {t("resume_cta")}
      </a>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-accent via-border to-transparent" />

        <div className="space-y-12">
          {positionKeys.map((key, index) => (
            <div key={key} className="relative pl-8 md:pl-20">
              {/* Timeline dot */}
              <div
                className={`absolute left-0 md:left-8 top-1.5 w-3 h-3 rounded-full border-2 -translate-x-[5px] ${
                  index === 0
                    ? "bg-accent border-accent glow-accent"
                    : "bg-background border-border"
                }`}
              />

              {/* Period badge */}
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="text-xs font-mono text-accent bg-accent/10 px-2.5 py-1 rounded">
                  {t(`positions.${key}.period`)}
                </span>
                <span className="text-xs text-muted">
                  {t(`positions.${key}.location`)}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold">
                {t(`positions.${key}.company`)}
              </h3>
              <p className="text-accent-light text-sm font-medium mt-1">
                {t(`positions.${key}.role`)}
              </p>
              <p className="mt-3 text-muted leading-relaxed">
                {t(`positions.${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
