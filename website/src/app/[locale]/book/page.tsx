import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section, SectionHeader } from "@/components/Section";

export default async function BookPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("book");

  return (
    <Section className="pt-32">
      <SectionHeader title={t("title")} headline={t("headline")} />

      <div className="grid lg:grid-cols-5 gap-12 items-start">
        {/* Book Cover */}
        <div className="lg:col-span-2 flex justify-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-accent/5 rounded-lg blur-xl" />
            <img
              src="/images/honor-bound-cover.jpg"
              alt="Honor Bound book cover"
              className="relative w-64 rounded-lg shadow-2xl border border-border/50"
            />
          </div>
        </div>

        {/* Book Info */}
        <div className="lg:col-span-3 space-y-6">
          <p className="text-accent font-mono text-sm">{t("publisher")}</p>

          <p className="text-lg leading-relaxed">{t("synopsis")}</p>

          {/* Quote */}
          <blockquote className="border-l-2 border-crimson pl-6 py-2">
            <p className="text-muted italic text-lg leading-relaxed">
              &ldquo;{t("quote")}&rdquo;
            </p>
          </blockquote>

          {/* Buy buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <a
              href="https://www.amazon.com/Honor-Bound-Journey-Wrongful-Conviction/dp/1451696000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-[#FF9900] hover:bg-[#FFB340] text-black font-medium rounded-md transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M.045 18.02c.07-.116.36-.172.53-.076 1.61.868 3.48 1.459 5.6 1.78 2.12.32 4.08.292 5.89-.084-.018.02-.038.04-.06.06-.32.36-.68.6-1.12.72l-2.16.66c-1.34.36-2.78.48-4.32.34C2.89 21.26 1.63 20.74.87 19.86c-.18-.21-.3-.46-.36-.72-.02-.1-.03-.2-.02-.3.01-.1.04-.2.08-.28.04-.06.08-.12.14-.16l.06-.02.05-.02z" />
                <path d="M14.4 17.92c.24-.32.5-.6.78-.84.28-.24.6-.4.94-.48.34-.08.7-.06 1.06.06.36.12.66.34.9.64.24.3.38.66.42 1.06.04.4-.04.78-.24 1.14s-.5.66-.88.9c-.38.24-.8.38-1.26.42-.46.04-.9-.04-1.3-.24-.4-.2-.72-.5-.96-.88-.24-.38-.34-.82-.3-1.3.04-.48.24-.92.54-1.3l.3-.18z" />
              </svg>
              {t("buy_amazon")}
            </a>
            <a
              href="https://www.barnesandnoble.com/w/honor-bound-raffaele-sollecito/1111288498"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 border border-border hover:border-accent/50 font-medium rounded-md transition-colors"
            >
              {t("buy_bn")}
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
