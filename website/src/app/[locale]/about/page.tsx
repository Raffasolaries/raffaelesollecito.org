import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section, SectionHeader } from "@/components/Section";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <>
      <Section className="pt-32">
        <SectionHeader title={t("title")} headline={t("headline")} />

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Bio */}
          <div className="lg:col-span-3 space-y-6">
            <p className="text-lg leading-relaxed">{t("bio_intro")}</p>
            <p className="text-muted leading-relaxed">{t("bio_current")}</p>
            <p className="text-muted leading-relaxed">{t("bio_personal")}</p>
          </div>

          {/* Profile photo + Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main photo */}
            <div className="relative">
              <div className="absolute -inset-2 bg-accent/10 rounded-lg blur-xl" />
              <img
                src="/images/raffaele-profile.jpg"
                alt="Raffaele Sollecito"
                className="relative w-full rounded-lg border border-border/50 object-cover aspect-[4/5]"
              />
            </div>

            {/* Stats Card */}
            <div className="bg-surface border border-border/50 rounded-lg p-6 space-y-4">
              {(["years", "certs", "clients", "countries"] as const).map(
                (key) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-muted text-sm">
                      {t(`stats.${key}_label`)}
                    </span>
                    <span className="text-2xl font-bold text-accent">
                      {t(`stats.${key}`)}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* Photo Gallery — childhood photos from family collection */}
      <Section className="bg-surface/30 !py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { src: "/images/family/parents-young.jpg", alt: "Parents in their youth" },
            { src: "/images/family/baptism.jpg", alt: "Baptism" },
            { src: "/images/family/with-mom.jpg", alt: "With mom" },
          ].map((photo) => (
            <div key={photo.src} className="overflow-hidden rounded-lg border border-border/50">
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-48 md:h-64 object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Personal Section */}
      <Section>
        <div className="max-w-3xl">
          <h3 className="text-2xl font-bold mb-6">{t("personal_title")}</h3>
          <p className="text-muted leading-relaxed text-lg">
            {t("personal_text")}
          </p>
        </div>
      </Section>

      {/* Education */}
      <Section>
        <h3 className="text-2xl font-bold mb-8">Education</h3>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-2 h-2 mt-2.5 rounded-full bg-accent shrink-0" />
            <div>
              <h4 className="font-semibold">
                Universit&agrave; degli Studi di Verona
              </h4>
              <p className="text-muted text-sm">
                MSc in Software Engineering — Visual Computing (2009 — 2014)
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-2 h-2 mt-2.5 rounded-full bg-accent shrink-0" />
            <div>
              <h4 className="font-semibold">
                Universit&agrave; di Camerino
              </h4>
              <p className="text-muted text-sm">
                State Qualification for Professional Activity — Computer
                Software Engineering (2014)
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-2 h-2 mt-2.5 rounded-full bg-accent shrink-0" />
            <div>
              <h4 className="font-semibold">
                Universit&agrave; degli Studi di Perugia
              </h4>
              <p className="text-muted text-sm">
                BSc in Computer Science (2003 — 2008)
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
