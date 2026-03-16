import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { Section } from "@/components/Section";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center speed-lines">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-crimson/5 rounded-full blur-3xl" />
          {/* Manga-style vertical line accent */}
          <div className="absolute top-0 right-[15%] w-px h-full bg-gradient-to-b from-transparent via-accent/20 to-transparent hidden lg:block" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-3">
            <p className="text-accent font-mono text-sm tracking-widest uppercase mb-4 animate-fade-up">
              {t("hero.greeting")}
            </p>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-tight animate-fade-up" style={{ animationDelay: "0.1s" }}>
              {t("hero.name")}
            </h1>
            <p className="mt-2 text-2xl sm:text-3xl text-muted font-light animate-fade-up" style={{ animationDelay: "0.2s" }}>
              {t("hero.title")}
            </p>
            <p className="mt-6 text-lg text-muted leading-relaxed max-w-xl animate-fade-up" style={{ animationDelay: "0.3s" }}>
              {t("hero.subtitle")}
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: "0.4s" }}>
              <Link
                href={`/${locale}/projects`}
                className="inline-flex items-center px-6 py-3 bg-accent hover:bg-accent-light text-white font-medium rounded-md transition-all glow-accent"
              >
                {t("hero.cta_work")}
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center px-6 py-3 border border-border hover:border-accent/50 text-foreground font-medium rounded-md transition-all"
              >
                {t("hero.cta_contact")}
              </Link>
            </div>

            {/* Location badge */}
            <div className="mt-12 flex items-center gap-2 text-sm text-muted animate-fade-up" style={{ animationDelay: "0.5s" }}>
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t("hero.location")}
            </div>
          </div>

          {/* Hero Photo */}
          <div className="lg:col-span-2 hidden lg:block animate-fade-up" style={{ animationDelay: "0.5s" }}>
            <div className="relative">
              <div className="absolute -inset-3 bg-accent/10 rounded-2xl blur-2xl" />
              <img
                src="/images/raffaele-3.jpg"
                alt="Raffaele Sollecito"
                className="relative w-full rounded-2xl border border-border/50 object-cover aspect-[4/5]"
              />
            </div>
          </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted text-xs animate-bounce">
          <span>{t("hero.scroll")}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Quick Stats */}
      <Section className="bg-surface/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {(["years", "certs", "clients", "countries"] as const).map((key) => (
            <div key={key} className="text-center">
              <div className="text-4xl font-bold text-accent">
                {t(`about.stats.${key}`)}
              </div>
              <div className="mt-2 text-sm text-muted">
                {t(`about.stats.${key}_label`)}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Featured Sections */}
      <Section>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cloud Architecture */}
          <Link
            href={`/${locale}/experience`}
            className="group p-8 bg-surface rounded-lg border border-border/50 hover:border-accent/30 transition-all hover:glow-accent"
          >
            <div className="w-12 h-12 rounded-md bg-accent/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold group-hover:text-accent transition-colors">
              Cloud Architecture
            </h3>
            <p className="mt-2 text-sm text-muted">
              AWS Solutions Architect Professional. 10+ years designing secure, scalable enterprise infrastructure.
            </p>
          </Link>

          {/* Author */}
          <Link
            href={`/${locale}/book`}
            className="group p-8 bg-surface rounded-lg border border-border/50 hover:border-crimson/30 transition-all"
          >
            <div className="w-12 h-12 rounded-md bg-crimson/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-crimson" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold group-hover:text-crimson transition-colors">
              {t("book.title")}
            </h3>
            <p className="mt-2 text-sm text-muted">
              {t("book.publisher")}
            </p>
          </Link>

          {/* The Case */}
          <Link
            href={`/${locale}/case`}
            className="group p-8 bg-surface rounded-lg border border-border/50 hover:border-accent/30 transition-all"
          >
            <div className="w-12 h-12 rounded-md bg-accent/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold group-hover:text-accent transition-colors">
              {t("case.title")}
            </h3>
            <p className="mt-2 text-sm text-muted">
              {t("case.headline")}
            </p>
          </Link>
        </div>
      </Section>
    </>
  );
}
