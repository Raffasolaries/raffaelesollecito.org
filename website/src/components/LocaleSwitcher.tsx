"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export function LocaleSwitcher() {
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1];
  const targetLocale = currentLocale === "en" ? "it" : "en";
  const targetPath = pathname.replace(`/${currentLocale}`, `/${targetLocale}`);

  return (
    <Link
      href={targetPath}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-muted hover:text-foreground border border-border rounded-md hover:border-accent/50 transition-all"
      title={targetLocale === "en" ? "Switch to English" : "Passa all'italiano"}
    >
      <span className="text-base leading-none">
        {targetLocale === "en" ? "🇬🇧" : "🇮🇹"}
      </span>
      {targetLocale.toUpperCase()}
    </Link>
  );
}
