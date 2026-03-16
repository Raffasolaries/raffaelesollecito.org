"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LocaleSwitcher } from "./LocaleSwitcher";

const navItems = [
  { key: "about", href: "/about" },
  { key: "experience", href: "/experience" },
  { key: "projects", href: "/projects" },
  { key: "book", href: "/book" },
  { key: "case", href: "/case" },
  { key: "documents", href: "/documents" },
  { key: "contact", href: "/contact" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="text-lg font-bold tracking-tight hover:text-accent transition-colors"
          >
            <span className="text-accent">R</span>S
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const fullPath = `/${locale}${item.href}`;
              const isActive = pathname === fullPath || pathname === `${fullPath}/`;
              return (
                <Link
                  key={item.key}
                  href={fullPath}
                  className={`px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "text-accent font-medium"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {t(item.key)}
                </Link>
              );
            })}
            <div className="ml-4 pl-4 border-l border-border">
              <LocaleSwitcher />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-3 lg:hidden">
            <LocaleSwitcher />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-muted hover:text-foreground p-2"
              aria-label="Toggle menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden pb-4 border-t border-border/50 mt-2 pt-4">
            {navItems.map((item) => {
              const fullPath = `/${locale}${item.href}`;
              const isActive = pathname === fullPath || pathname === `${fullPath}/`;
              return (
                <Link
                  key={item.key}
                  href={fullPath}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "text-accent font-medium"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </header>
  );
}
