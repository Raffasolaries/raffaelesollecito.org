import type { Metadata } from "next";
import { locales, type Locale } from "@/i18n/config";

export const SITE_URL = "https://raffaelesollecito.org";
export const RESUME_URL = "https://resume.raffaelesollecito.org/";
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Canonical route paths (no locale, with trailing slash). "" = home. */
export const ROUTES = [
  "",
  "about/",
  "experience/",
  "projects/",
  "books/",
  "case/",
  "documents/",
  "family/",
  "archive/",
  "contact/",
] as const;
export type Route = (typeof ROUTES)[number];

const OG_LOCALES: Record<string, string> = { en: "en_US", it: "it_IT", de: "de_DE" };
export const ogLocale = (locale: string) => OG_LOCALES[locale] ?? "en_US";

export const localizedUrl = (locale: string, path: Route | string = "") =>
  `${SITE_URL}/${locale}/${path}`;

export function languageAlternates(path: Route | string = "") {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = localizedUrl(l, path);
  languages["x-default"] = localizedUrl("en", path);
  return languages;
}

interface PageMetaInput {
  locale: string;
  path: Route | string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article" | "profile" | "book";
}

/**
 * Per-page metadata: unique title/description, self-referencing canonical,
 * hreflang for every locale plus x-default, OpenGraph and Twitter cards.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  image = "/og-image.png",
  imageAlt = "Raffaele Sollecito",
  type = "website",
}: PageMetaInput): Metadata {
  const url = localizedUrl(locale, path);
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Raffaele Sollecito",
      locale: ogLocale(locale),
      alternateLocale: locales.filter((l) => l !== locale).map(ogLocale),
      type: type === "book" ? "book" : type,
      images: [{ url: image, width: 1200, height: 630, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@Raffasolaries",
    },
  };
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Breadcrumb JSON-LD for a page one level below the localized home. */
export function breadcrumbLd(locale: string, homeLabel: string, label: string, path: Route) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: homeLabel, item: localizedUrl(locale) },
      { "@type": "ListItem", position: 2, name: label, item: localizedUrl(locale, path) },
    ],
  };
}
