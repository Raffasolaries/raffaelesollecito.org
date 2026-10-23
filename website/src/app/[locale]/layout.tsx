import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { GoogleAnalytics } from "@next/third-parties/google";
import { locales, type Locale } from "@/i18n/config";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL, PERSON_ID, WEBSITE_ID, RESUME_URL, CONTACT, COMPANY } from "@/lib/site";
import { THEME_COLORS, THEME_INIT_SCRIPT } from "@/lib/theme";
import { CERTS, badgeUrl } from "@/lib/certs";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Site-wide metadata only. Titles, descriptions, canonicals, hreflang and
 * OpenGraph are set per page via `pageMetadata()` in each page.tsx.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`@/messages/${locale}.json`)).default;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: messages.metadata.title,
      template: messages.metadata.template,
    },
    description: messages.metadata.description,
    applicationName: "Raffaele Sollecito",
    authors: [{ name: "Raffaele Sollecito", url: SITE_URL }],
    creator: "Raffaele Sollecito",
    publisher: "Raffaele Sollecito",
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "32x32" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
      other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
        ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
        : undefined,
    },
  };
}

export const viewport: Viewport = {
  themeColor: THEME_COLORS,
};

/** Entity graph shared by every page: Person (the subject) + WebSite. */
const entityGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: "Raffaele Sollecito",
      givenName: "Raffaele",
      familyName: "Sollecito",
      url: SITE_URL,
      image: `${SITE_URL}/images/raffaele-1.jpg`,
      jobTitle: "Principal Cloud Solutions Architect",
      description:
        "Principal Cloud Solutions Architect (AWS) and founder of Kumokage GmbH in Zürich; AWS Certified Solutions Architect – Professional and Security – Specialty, and AWS Certification Subject Matter Expert; author of the memoirs Honor Bound (Simon & Schuster, 2012) and Un passo fuori dalla notte (Longanesi, 2015).",
      birthPlace: { "@type": "Place", name: "Bari, Italy" },
      nationality: { "@type": "Country", name: "Italy" },
      homeLocation: {
        "@type": "Place",
        address: { "@type": "PostalAddress", addressLocality: "Zürich", addressRegion: "ZH", addressCountry: "CH" },
      },
      email: `mailto:${CONTACT.email}`,
      telephone: CONTACT.phone,
      worksFor: {
        "@type": "Organization",
        name: COMPANY.name,
        url: COMPANY.url,
        sameAs: [COMPANY.linkedin],
        address: { "@type": "PostalAddress", addressLocality: "Zürich", addressCountry: "CH" },
      },
      alumniOf: [
        { "@type": "CollegeOrUniversity", name: "Università degli Studi di Verona", url: "https://www.univr.it/" },
        { "@type": "CollegeOrUniversity", name: "Università degli Studi di Perugia", url: "https://www.unipg.it/" },
      ],
      hasCredential: CERTS.map((c) => ({
        "@type": "EducationalOccupationalCredential",
        name: c.name,
        credentialCategory: c.kind,
        recognizedBy: { "@type": "Organization", name: "Amazon Web Services" },
        url: badgeUrl(c),
      })),
      knowsAbout: [
        "Amazon Web Services", "Cloud Architecture", "Cloud Security", "AWS Control Tower", "Landing Zones",
        "Amazon EKS", "Kubernetes", "Terraform", "AWS CDK", "CloudFormation", "Disaster Recovery",
        "Amazon Bedrock", "Agentic AI", "GitLab CI/CD", "Zero Trust Networking",
      ],
      knowsLanguage: ["it", "en", "es", "de"],
      sameAs: [
        "https://www.linkedin.com/in/raffasolaries",
        "https://github.com/Raffasolaries",
        "https://www.credly.com/users/raffasolaries",
        "https://twitter.com/Raffasolaries",
        "https://www.amazon.com/Honor-Bound-Journey-Wrongful-Conviction/dp/1451696000",
        RESUME_URL,
      ],
      subjectOf: [
        { "@type": "Book", "@id": `${SITE_URL}/en/books/#honor-bound` },
        { "@type": "Book", "@id": `${SITE_URL}/en/books/#un-passo-fuori-dalla-notte` },
      ],
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE_URL,
      name: "Raffaele Sollecito",
      inLanguage: [...locales],
      publisher: { "@id": PERSON_ID },
      about: { "@id": PERSON_ID },
    },
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: THEME_INIT_SCRIPT,
          }}
        />
        <JsonLd data={entityGraph} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} font-sans antialiased bg-background text-foreground`}
      >
        <NextIntlClientProvider messages={messages}>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </NextIntlClientProvider>
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  );
}
