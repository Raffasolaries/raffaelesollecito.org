import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/Section";

const timeline = [
  { year: "2007", event_en: "Wrongfully arrested in Perugia, Italy", event_it: "Arrestato ingiustamente a Perugia, Italia" },
  { year: "2009", event_en: "Convicted at first trial (Massei court)", event_it: "Condannato al primo processo (Corte Massei)" },
  { year: "2011", event_en: "Acquitted on appeal (Hellmann court)", event_it: "Assolto in appello (Corte Hellmann)" },
  { year: "2013", event_en: "Supreme Court overturns acquittal, orders new appeal", event_it: "La Cassazione annulla l'assoluzione, ordina nuovo appello" },
  { year: "2014", event_en: "Re-convicted at Florence appeal (Nencini court)", event_it: "Ricondannato all'appello di Firenze (Corte Nencini)" },
  { year: "2015", event_en: "Definitively acquitted by Supreme Court of Cassation", event_it: "Definitivamente assolto dalla Corte Suprema di Cassazione" },
];

export default async function CasePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("case");
  const isItalian = locale === "it";

  return (
    <>
      <Section className="pt-32">
        <SectionHeader title={t("title")} headline={t("headline")} />

        <div className="max-w-3xl">
          <p className="text-lg leading-relaxed">{t("intro")}</p>
        </div>
      </Section>

      {/* Timeline */}
      <Section className="bg-surface/30">
        <h3 className="text-2xl font-bold mb-10">{t("sections.timeline")}</h3>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-crimson via-accent to-transparent" />
          <div className="space-y-8">
            {timeline.map((item, i) => (
              <div key={item.year} className="relative pl-12">
                <div
                  className={`absolute left-4 top-1.5 w-3 h-3 rounded-full -translate-x-[5px] ${
                    i === timeline.length - 1
                      ? "bg-accent border-2 border-accent glow-accent"
                      : "bg-background border-2 border-crimson"
                  }`}
                />
                <span className="text-sm font-mono text-accent">{item.year}</span>
                <p className="mt-1 text-foreground">
                  {isItalian ? item.event_it : item.event_en}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Link to Documents */}
      <Section>
        <div className="bg-surface border border-border/50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            {t("sections.documents")}
          </h3>
          <p className="text-muted mb-6 max-w-lg mx-auto">
            {locale === "it"
              ? "Tutte le sentenze, perizie e documenti legali sono disponibili nell'archivio documenti."
              : "All court decisions, expert reports, and legal documents are available in the documents archive."}
          </p>
          <Link
            href={`/${locale}/documents`}
            className="inline-flex items-center px-6 py-3 bg-accent hover:bg-accent-light text-white font-medium rounded-md transition-all"
          >
            {t("sections.documents")}
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </Section>
    </>
  );
}
