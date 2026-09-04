import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/Section";
import { CERTS, CREDLY_PROFILE, badgeUrl } from "@/lib/certs";
import { pageMetadata, RESUME_URL } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.home" });
  return {
    ...pageMetadata({ locale, path: "", title: t("title"), description: t("description"), type: "profile" }),
    // Home title must not use the "%s · Raffaele Sollecito" template (would duplicate the name).
    title: { absolute: t("title") },
  };
}

const featuredWork = ["gaming", "iot", "fintech"] as const;

const serviceIcons: Record<string, string> = {
  landing: "M3 7l9-4 9 4-9 4-9-4zm0 5l9 4 9-4M3 17l9 4 9-4",
  security: "M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3zm0 5v5m0 3h.01",
  platforms: "M4 6h16v5H4zM4 13h16v5H4zM8 8.5h.01M8 15.5h.01",
  ai: "M12 3v3m0 12v3M5 12H2m20 0h-3M7 7l-2-2m14 0l-2 2M7 17l-2 2m14 0l-2-2M12 8a4 4 0 100 8 4 4 0 000-8z",
};

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      {/* ───────────────── Hero ───────────────── */}
      <section className="relative min-h-[78vh] lg:min-h-[84vh] max-h-[1100px] flex items-center speed-lines mandala">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                    <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-crimson/5 rounded-full blur-3xl" />
          <div className="absolute top-0 right-[15%] w-px h-full bg-gradient-to-b from-transparent via-accent/20 to-transparent hidden lg:block" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 relative w-full">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-3">
              <p className="text-accent font-mono text-xs sm:text-sm tracking-widest uppercase mb-5 animate-fade-up">
                {t("hero.eyebrow")}
              </p>
              <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1.05] animate-fade-up" style={{ animationDelay: "0.1s" }}>
                {t("hero.name")}
              </h1>
              <p className="mt-6 text-2xl sm:text-3xl font-light leading-snug text-foreground/90 max-w-2xl animate-fade-up" style={{ animationDelay: "0.2s" }}>
                {t("hero.title")}
              </p>
              <p className="mt-6 text-lg text-muted leading-relaxed max-w-xl animate-fade-up" style={{ animationDelay: "0.3s" }}>
                {t("hero.subtitle")}
              </p>

              <div className="mt-10 flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: "0.4s" }}>
                <Link href={`/${locale}/projects/`} className="inline-flex items-center px-6 py-3 bg-accent hover:bg-accent-light text-white font-medium rounded-md transition-all glow-accent">
                  {t("hero.cta_work")}
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
                <a href={RESUME_URL} className="inline-flex items-center px-6 py-3 border border-border hover:border-accent/50 text-foreground font-medium rounded-md transition-all">
                  <svg className="mr-2 w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" /></svg>
                  {t("hero.cta_resume")}
                </a>
                <Link href={`/${locale}/contact/`} className="inline-flex items-center px-6 py-3 text-muted hover:text-foreground font-medium rounded-md transition-all">
                  {t("hero.cta_contact")}
                </Link>
              </div>

              <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted animate-fade-up" style={{ animationDelay: "0.5s" }}>
                <span className="inline-flex items-center gap-2">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {t("hero.location")}
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" /></span>
                  {t("hero.availability")}
                </span>
              </div>
            </div>

            <div className="lg:col-span-2 hidden lg:block animate-fade-up" style={{ animationDelay: "0.5s" }}>
              <div className="relative">
                <div className="absolute -inset-3 bg-accent/10 rounded-2xl blur-2xl" aria-hidden="true" />
                <img
                  src="/images/raffaele-3.jpg"
                  alt="Raffaele Sollecito, Principal Cloud Solutions Architect"
                  width={2560}
                  height={1706}
                  fetchPriority="high"
                  className="relative w-full rounded-2xl border border-border/50 object-cover aspect-[4/5]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── Verified credentials ───────────────── */}
      <Section className="bg-surface/30 !py-12">
        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
          <div className="md:w-56 shrink-0">
            <p className="text-accent text-xs font-mono tracking-widest uppercase">{t("home.certs_title")}</p>
            <a href={CREDLY_PROFILE} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-sm text-muted hover:text-accent transition-colors">
              {t("home.certs_note")} ↗
            </a>
          </div>
          <ul className="flex flex-wrap gap-2">
            {CERTS.map((c) => (
              <li key={c.badgeId}>
                <a
                  href={badgeUrl(c)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={c.name}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition-colors ${
                    c.level === "professional" || c.level === "specialty"
                      ? "border-accent/50 bg-accent/10 text-foreground hover:bg-accent/20"
                      : "border-border/60 bg-surface text-muted hover:text-foreground hover:border-accent/40"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${c.level === "professional" || c.level === "specialty" ? "bg-accent" : "bg-muted"}`} aria-hidden="true" />
                  {c.short}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ───────────────── What I do ───────────────── */}
      <Section>
        <SectionHeader title={t("home.services_title")} headline={t("home.services_headline")} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(["landing", "security", "platforms", "ai"] as const).map((key) => (
            <div key={key} className="p-7 bg-surface rounded-lg border border-border/50 hover:border-accent/30 transition-all">
              <div className="w-11 h-11 rounded-md bg-accent/10 flex items-center justify-center mb-5">
                <svg className="w-5.5 h-5.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d={serviceIcons[key]} /></svg>
              </div>
              <h3 className="text-lg font-semibold">{t(`home.services.${key}.title`)}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">{t(`home.services.${key}.text`)}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ───────────────── Recent engagements ───────────────── */}
      <Section className="bg-surface/30">
        <SectionHeader title={t("home.work_title")} headline={t("home.work_headline")} />
        <div className="grid lg:grid-cols-3 gap-6">
          {featuredWork.map((key) => (
            <article key={key} className="group flex flex-col p-7 bg-surface rounded-lg border border-border/50 hover:border-accent/30 transition-all">
              <span className="self-start text-xs font-mono text-accent bg-accent/10 px-2.5 py-1 rounded">{t(`projects.items.${key}.period`)}</span>
              <h3 className="mt-4 text-lg font-bold leading-snug group-hover:text-accent transition-colors">{t(`projects.items.${key}.title`)}</h3>
              <p className="mt-1 text-sm text-accent-light">{t(`projects.items.${key}.client`)}</p>
              <p className="mt-4 text-sm text-muted leading-relaxed line-clamp-6">{t(`projects.items.${key}.description`)}</p>
            </article>
          ))}
        </div>
        <div className="mt-10">
          <Link href={`/${locale}/projects/`} className="inline-flex items-center text-accent hover:text-accent-light font-medium">
            {t("home.work_cta")}
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </Section>

      {/* ───────────────── Stats + career strip ───────────────── */}
      <Section className="!py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {(["years", "certs", "clients", "countries"] as const).map((key) => (
            <div key={key} className="text-center">
              <div className="text-4xl font-bold text-accent">{t(`about.stats.${key}`)}</div>
              <div className="mt-2 text-sm text-muted">{t(`about.stats.${key}_label`)}</div>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-muted">
          <span className="font-mono text-xs uppercase tracking-widest text-accent mr-3">{t("home.trusted_title")}</span>
          {t("home.trusted_text")}{" "}
          <Link href={`/${locale}/experience/`} className="text-accent hover:underline">{t("nav.experience")} →</Link>
        </p>
      </Section>

      {/* ───────────────── Beyond the cloud ───────────────── */}
      <Section className="bg-surface/30">
        <SectionHeader title={t("home.beyond_title")} headline={t("home.beyond_headline")} />
        <div className="grid md:grid-cols-2 gap-6">
          <Link href={`/${locale}/books/`} className="group flex gap-6 p-7 bg-surface rounded-lg border border-border/50 hover:border-crimson/30 transition-all">
            <img src="/images/honor-bound-cover.jpg" alt="Honor Bound book cover" width={678} height={1024} loading="lazy" className="w-20 h-auto rounded shadow-lg border border-border/50 shrink-0 self-start" />
            <div>
              <h3 className="text-lg font-semibold group-hover:text-crimson transition-colors">{t("home.beyond_books_title")}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">{t("home.beyond_books_text")}</p>
              <span className="mt-4 inline-block text-sm text-crimson">{t("common.read_more")} →</span>
            </div>
          </Link>
          <Link href={`/${locale}/case/`} className="group p-7 bg-surface rounded-lg border border-border/50 hover:border-accent/30 transition-all">
            <div className="w-11 h-11 rounded-md bg-accent/10 flex items-center justify-center mb-5">
              <svg className="w-5.5 h-5.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
            </div>
            <h3 className="text-lg font-semibold group-hover:text-accent transition-colors">{t("home.beyond_case_title")}</h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">{t("home.beyond_case_text")}</p>
            <span className="mt-4 inline-block text-sm text-accent">{t("common.read_more")} →</span>
          </Link>
        </div>
      </Section>

      {/* ───────────────── CTA ───────────────── */}
      <Section>
        <div className="relative overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 via-surface to-surface p-10 sm:p-14 text-center">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-accent/10 rounded-full blur-3xl" aria-hidden="true" />
          <h2 className="relative text-3xl sm:text-4xl font-bold tracking-tight">{t("home.cta_title")}</h2>
          <p className="relative mt-4 text-muted max-w-2xl mx-auto">{t("home.cta_text")}</p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link href={`/${locale}/contact/`} className="inline-flex items-center px-6 py-3 bg-accent hover:bg-accent-light text-white font-medium rounded-md transition-all glow-accent">{t("home.cta_button")}</Link>
            <a href={RESUME_URL} className="inline-flex items-center px-6 py-3 border border-border hover:border-accent/50 font-medium rounded-md transition-all">{t("hero.cta_resume")}</a>
          </div>
        </div>
      </Section>
    </>
  );
}
