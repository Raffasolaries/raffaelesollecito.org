import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section, SectionHeader } from "@/components/Section";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, breadcrumbLd, SITE_URL, PERSON_ID, localizedUrl } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.books" });
  return pageMetadata({
    locale,
    path: "books/",
    title: t("title"),
    description: t("description"),
    image: "/images/honor-bound-cover.jpg",
    imageAlt: "Honor Bound — Raffaele Sollecito",
    type: "book",
  });
}

const HONOR = {
  id: `${SITE_URL}/en/books/#honor-bound`,
  cover: "/images/honor-bound-cover.jpg",
  amazon: "https://www.amazon.com/Honor-Bound-Journey-Wrongful-Conviction/dp/1451696000",
  bn: "https://www.barnesandnoble.com/w/honor-bound-raffaele-sollecito/1111288498",
  isbn: "9781451696004",
};

const PASSO = {
  id: `${SITE_URL}/en/books/#un-passo-fuori-dalla-notte`,
  cover: "/images/un-passo-fuori-dalla-notte-cover.jpg",
  amazon: "https://www.amazon.it/s?k=9788830443938",
  ibs: "https://www.ibs.it/search/?ts=as&query=9788830443938",
  isbn: "9788830443938",
};

export default async function BooksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("books");
  const tn = await getTranslations("nav");

  const booksLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Book",
        "@id": HONOR.id,
        name: "Honor Bound: My Journey to Hell and Back with Amanda Knox",
        alternateName: "Honor Bound",
        author: [{ "@id": PERSON_ID }, { "@type": "Person", name: "Andrew Gumbel" }],
        publisher: { "@type": "Organization", name: "Simon & Schuster" },
        datePublished: "2012-09-18",
        inLanguage: "en",
        isbn: HONOR.isbn,
        bookFormat: "https://schema.org/Hardcover",
        genre: "Memoir",
        image: `${SITE_URL}${HONOR.cover}`,
        url: localizedUrl(locale, "books/") + "#honor-bound",
        offers: [
          { "@type": "Offer", url: HONOR.amazon, seller: { "@type": "Organization", name: "Amazon" } },
          { "@type": "Offer", url: HONOR.bn, seller: { "@type": "Organization", name: "Barnes & Noble" } },
        ],
      },
      {
        "@type": "Book",
        "@id": PASSO.id,
        name: "Un passo fuori dalla notte",
        alternateName: "Un passo fuori dalla notte. Tutto quello che non avete mai immaginato di me",
        author: { "@id": PERSON_ID },
        publisher: { "@type": "Organization", name: "Longanesi" },
        datePublished: "2015-10",
        inLanguage: "it",
        isbn: PASSO.isbn,
        bookFormat: "https://schema.org/Paperback",
        genre: "Memoir",
        image: `${SITE_URL}${PASSO.cover}`,
        url: localizedUrl(locale, "books/") + "#un-passo-fuori-dalla-notte",
        offers: [
          { "@type": "Offer", url: PASSO.amazon, seller: { "@type": "Organization", name: "Amazon.it" } },
          { "@type": "Offer", url: PASSO.ibs, seller: { "@type": "Organization", name: "IBS" } },
        ],
      },
      breadcrumbLd(locale, tn("home"), tn("books"), "books/"),
    ],
  };

  const Buy = ({ href, label, primary }: { href: string; label: string; primary?: boolean }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        primary
          ? "inline-flex items-center px-5 py-2.5 bg-accent hover:bg-accent-light text-white font-medium rounded-md transition-colors"
          : "inline-flex items-center px-5 py-2.5 border border-border hover:border-accent/50 font-medium rounded-md transition-colors"
      }
    >
      {label} ↗
    </a>
  );

  return (
    <>
      <JsonLd data={booksLd} />
      <Section className="pt-32">
        <SectionHeader title={t("title")} headline={t("headline")} subtitle={t("subtitle")} />

        {/* Honor Bound */}
        <article id="honor-bound" className="grid lg:grid-cols-5 gap-12 items-start scroll-mt-28">
          <div className="lg:col-span-2 flex justify-center lg:justify-start">
            <div className="relative">
              <div className="absolute -inset-4 bg-crimson/5 rounded-lg blur-xl" aria-hidden="true" />
              <img
                src={HONOR.cover}
                alt="Honor Bound book cover"
                width={678}
                height={1024}
                className="relative w-64 rounded-lg shadow-2xl border border-border/50"
              />
            </div>
          </div>
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{t("honor.title")}</h2>
              <p className="mt-1 text-lg text-muted">{t("honor.subtitle")}</p>
              <p className="mt-3 text-accent font-mono text-sm">{t("honor.meta")}</p>
            </div>
            <p className="text-lg leading-relaxed">{t("honor.synopsis")}</p>
            <blockquote className="border-l-2 border-crimson pl-6 py-2">
              <p className="text-muted italic text-lg leading-relaxed">&ldquo;{t("honor.quote")}&rdquo;</p>
            </blockquote>
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-muted mb-3">{t("buy")}</p>
              <div className="flex flex-wrap gap-3">
                <Buy href={HONOR.amazon} label={t("honor.amazon")} primary />
                <Buy href={HONOR.bn} label={t("honor.bn")} />
              </div>
            </div>
          </div>
        </article>
      </Section>

      {/* Un passo fuori dalla notte */}
      <Section className="bg-surface/30">
        <article id="un-passo-fuori-dalla-notte" className="grid lg:grid-cols-5 gap-12 items-start scroll-mt-28">
          <div className="lg:col-span-3 space-y-6 order-2 lg:order-1">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{t("passo.title")}</h2>
              <p className="mt-1 text-lg text-muted">{t("passo.subtitle")}</p>
              <p className="mt-3 text-accent font-mono text-sm">{t("passo.meta")}</p>
            </div>
            <p className="text-lg leading-relaxed">{t("passo.synopsis")}</p>
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-muted mb-3">{t("buy")}</p>
              <div className="flex flex-wrap gap-3">
                <Buy href={PASSO.amazon} label={t("passo.amazon")} primary />
                <Buy href={PASSO.ibs} label={t("passo.ibs")} />
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative">
              <div className="absolute -inset-4 bg-accent/5 rounded-lg blur-xl" aria-hidden="true" />
              <img
                src={PASSO.cover}
                alt="Un passo fuori dalla notte — copertina"
                width={912}
                height={1401}
                loading="lazy"
                className="relative w-64 rounded-lg shadow-2xl border border-border/50"
              />
            </div>
          </div>
        </article>
      </Section>
    </>
  );
}
