import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section, SectionHeader } from "@/components/Section";

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

  return (
    <Section className="pt-32">
      <SectionHeader
        title={t("title")}
        headline={t("headline")}
        subtitle={t("subtitle")}
      />

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
