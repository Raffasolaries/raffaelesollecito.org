"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { locales, localeNames, type Locale } from "@/i18n/config";

const FLAGS: Record<Locale, string> = { en: "🇬🇧", it: "🇮🇹", de: "🇩🇪" };

export function LocaleSwitcher() {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const currentLocale = segments[1] as Locale;

  return (
    <nav
      aria-label="Language"
      className="inline-flex items-center rounded-md border border-border overflow-hidden"
    >
      {locales.map((locale) => {
        const active = locale === currentLocale;
        const targetPath = active
          ? pathname
          : ["", locale, ...segments.slice(2)].join("/") || `/${locale}/`;
        return (
          <Link
            key={locale}
            href={targetPath}
            hrefLang={locale}
            lang={locale}
            aria-current={active ? "page" : undefined}
            title={localeNames[locale]}
            className={`inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium transition-all ${
              active
                ? "bg-accent/10 text-foreground"
                : "text-muted hover:text-foreground hover:bg-surface-light"
            }`}
          >
            <span className="text-sm leading-none" aria-hidden="true">
              {FLAGS[locale]}
            </span>
            {locale.toUpperCase()}
          </Link>
        );
      })}
    </nav>
  );
}
