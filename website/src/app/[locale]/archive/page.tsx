import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section, SectionHeader } from "@/components/Section";

export default async function ArchivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("archive");

  return (
    <>
      <Section className="pt-32">
        <SectionHeader
          title={t("title")}
          headline={t("headline")}
          subtitle={t("subtitle")}
        />
      </Section>

      {/* Memories IT Company */}
      <Section className="bg-surface/30">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono text-accent bg-accent/10 px-2.5 py-1 rounded">
              {t("memories.period")}
            </span>
            <span className="text-xs text-muted">
              {t("memories.location")}
            </span>
          </div>

          <h3 className="text-2xl font-bold mb-4">{t("memories.name")}</h3>
          <p className="text-muted leading-relaxed mb-6">
            {t("memories.description")}
          </p>

          <div className="space-y-3">
            {(
              [
                "social_marketplaces",
                "booking_platforms",
                "angular_apps",
                "wordpress_sites",
                "forex_platform",
                "integrations",
              ] as const
            ).map((key) => (
              <div key={key} className="flex gap-3">
                <div className="w-1.5 h-1.5 mt-2 rounded-full bg-accent shrink-0" />
                <p className="text-muted text-sm">
                  {t(`memories.highlights.${key}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* SunTickets */}
      <Section>
        <div className="max-w-3xl">
          <div className="flex items-center gap-6 mb-6">
            <img
              src="/images/suntickets-logo.png"
              alt="SunTickets"
              className="h-16 w-auto object-contain"
            />
            <h3 className="text-2xl font-bold">{t("suntickets.name")}</h3>
          </div>

          <p className="text-muted leading-relaxed mb-6">
            {t("suntickets.description")}
          </p>

          <div className="bg-surface border border-border/50 rounded-lg p-6">
            <h4 className="font-semibold mb-4">{t("suntickets.features_title")}</h4>
            <div className="space-y-3">
              {(
                [
                  "beach_clubs",
                  "pools",
                  "resorts",
                  "campsites",
                  "restaurants",
                  "aerial_booking",
                ] as const
              ).map((key) => (
                <div key={key} className="flex gap-3">
                  <div className="w-1.5 h-1.5 mt-2 rounded-full bg-accent shrink-0" />
                  <p className="text-muted text-sm">
                    {t(`suntickets.features.${key}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
