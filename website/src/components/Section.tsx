import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className = "", id }: SectionProps) {
  return (
    <section id={id} className={`py-20 sm:py-28 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

export function SectionHeader({
  title,
  headline,
  subtitle,
}: {
  title: string;
  headline: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-16">
      <span className="text-accent text-sm font-mono tracking-widest uppercase">
        {title}
      </span>
      <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
        {headline}
      </h2>
      {subtitle && (
        <p className="mt-4 text-muted text-lg max-w-2xl">{subtitle}</p>
      )}
      <div className="divider-gothic mt-8 w-32" />
    </div>
  );
}
