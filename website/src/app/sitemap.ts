import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { ROUTES, localizedUrl, languageAlternates } from "@/lib/site";

export const dynamic = "force-static";

const PRIORITY: Record<string, number> = {
  "": 1.0,
  "about/": 0.9,
  "experience/": 0.9,
  "projects/": 0.9,
  "books/": 0.8,
  "case/": 0.8,
  "contact/": 0.7,
  "documents/": 0.6,
  "archive/": 0.5,
  "family/": 0.4,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];
  for (const path of ROUTES) {
    for (const locale of locales) {
      entries.push({
        url: localizedUrl(locale, path),
        lastModified,
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: PRIORITY[path] ?? 0.5,
        alternates: { languages: languageAlternates(path) },
      });
    }
  }
  return entries;
}
