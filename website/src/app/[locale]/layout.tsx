import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { GoogleAnalytics } from "@next/third-parties/google";
import { locales, type Locale } from "@/i18n/config";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL, PERSON_ID, WEBSITE_ID, RESUME_URL } from "@/lib/site";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
    other: {
      "theme-color": "#7c3aed",
    },
  };
}

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
        "Principal Cloud Solutions Architect and AWS Subject Matter Expert (six AWS certifications), founder of Aspect Solutions, and author of the memoirs Honor Bound (Simon & Schuster, 2012) and Un passo fuori dalla notte (Longanesi, 2015).",
      birthPlace: { "@type": "Place", name: "Bari, Italy" },
      nationality: { "@type": "Country", name: "Italy" },
      homeLocation: {
        "@type": "Place",
        address: { "@type": "PostalAddress", addressLocality: "Tavira", addressRegion: "Faro", addressCountry: "PT" },
      },
      email: "mailto:raffaele.sollecito@aspectsolutions.eu",
      worksFor: {
        "@type": "Organization",
        name: "Aspect Solutions, Unipessoal Lda",
        url: "https://www.linkedin.com/company/aspect-solutions-innovate/",
      },
      alumniOf: [
        { "@type": "CollegeOrUniversity", name: "Università degli Studi di Verona", url: "https://www.univr.it/" },
        { "@type": "CollegeOrUniversity", name: "Università degli Studi di Perugia", url: "https://www.unipg.it/" },
      ],
      hasCredential: [
        ["AWS Certified Solutions Architect – Professional", "1bf12aa4-d1ad-4178-96f9-b15bee1f7fde"],
        ["AWS Certified Security – Specialty", "20256e01-69c8-48f0-b139-e3468b9f5837"],
        ["AWS Certified Solutions Architect – Associate", "d2bcc5cd-06d7-431c-b96b-88027da8fdef"],
        ["AWS Certification Subject Matter Expert – Associate", "84f7bf87-5948-4b0e-8afe-3f5193d85883"],
        ["AWS Partner: Technical Accredited", "5c9c82af-b374-4e72-971f-a9e576007cca"],
        ["AWS Certified Cloud Practitioner", "a93d8bd5-9e9d-4aa6-98c3-fe49592ac2da"],
      ].map(([name, id]) => ({
        "@type": "EducationalOccupationalCredential",
        name,
        credentialCategory: "certification",
        recognizedBy: { "@type": "Organization", name: "Amazon Web Services" },
        url: `https://www.credly.com/badges/${id}`,
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
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}})()`,
          }}
        />
        <JsonLd data={entityGraph} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}
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
