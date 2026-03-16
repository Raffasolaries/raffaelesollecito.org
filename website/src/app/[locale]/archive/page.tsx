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
        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono text-accent bg-accent/10 px-2.5 py-1 rounded">
                {t("memories.period")}
              </span>
              <span className="text-xs text-muted">
                {t("memories.location")}
              </span>
            </div>

            <h3 className="text-2xl font-bold mb-2">{t("memories.name")}</h3>
            <p className="text-sm text-muted italic mb-6">
              {t("memories.tagline")}
            </p>
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

          {/* Memories Logo */}
          <div className="lg:col-span-2 flex items-center justify-center">
            <div className="relative w-full max-w-sm">
              <div className="absolute -inset-4 bg-accent/5 rounded-2xl blur-2xl" />
              <img
                src="/images/archive/memories-logo.png"
                alt="Memories IT Company"
                className="relative w-full rounded-xl border border-border/50 bg-white p-6"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* SunTickets */}
      <Section>
        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-6 mb-6">
              <img
                src="/images/suntickets-logo.png"
                alt="SunTickets"
                className="h-16 w-auto object-contain"
              />
            </div>

            <p className="text-muted leading-relaxed mb-6">
              {t("suntickets.description")}
            </p>

            <div className="bg-surface border border-border/50 rounded-lg p-6">
              <h4 className="font-semibold mb-4">
                {t("suntickets.features_title")}
              </h4>
              <div className="grid sm:grid-cols-2 gap-3">
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

            <p className="text-xs text-muted mt-4 italic">
              {t("suntickets.registered")}
            </p>
          </div>

          {/* SunTickets Infographic */}
          <div className="lg:col-span-2 flex items-start justify-center">
            <img
              src="/images/archive/suntickets-infographic.jpg"
              alt="SunTickets Infographic"
              className="w-full max-w-xs rounded-lg border border-border/50 shadow-lg"
            />
          </div>
        </div>
      </Section>

      {/* BeOnMemories */}
      <Section className="bg-surface/30">
        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3">
            <h3 className="text-2xl font-bold mb-4">
              {t("beonmemories.name")}
            </h3>
            <p className="text-muted leading-relaxed mb-6">
              {t("beonmemories.description")}
            </p>

            <div className="bg-surface border border-border/50 rounded-lg p-6">
              <h4 className="font-semibold mb-4">
                {t("beonmemories.tech_title")}
              </h4>
              <div className="space-y-3">
                {(
                  [
                    "social_network",
                    "ecommerce",
                    "marketplace",
                    "magento",
                    "oxwall",
                    "european_reach",
                  ] as const
                ).map((key) => (
                  <div key={key} className="flex gap-3">
                    <div className="w-1.5 h-1.5 mt-2 rounded-full bg-crimson shrink-0" />
                    <p className="text-muted text-sm">
                      {t(`beonmemories.features.${key}`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BeOnMemories Brochure */}
          <div className="lg:col-span-2 flex items-center justify-center">
            <div className="space-y-4 w-full max-w-sm">
              <img
                src="/images/archive/beonmemories-brochure.jpg"
                alt="BeOnMemories"
                className="w-full rounded-xl border border-border/50 shadow-lg"
              />
              <img
                src="/images/archive/beonmemories-design.png"
                alt="BeOnMemories — European reach"
                className="w-full rounded-xl border border-border/50 shadow-lg"
              />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
