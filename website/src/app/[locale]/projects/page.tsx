import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section, SectionHeader } from "@/components/Section";

const projectKeys = ["ublox", "ucapital", "reevo", "awake"] as const;

const techStacks: Record<string, string[]> = {
  ublox: ["CloudFormation", "Azure AD", "GitLab", "Serverless", "S3"],
  ucapital: [
    "Control Tower",
    "ECS",
    "AppSync",
    "Grafana",
    "Terraform",
    "Cognito",
  ],
  reevo: [
    "EKS",
    "ArgoCD",
    "Transit Gateway",
    "Suricata",
    "Direct Connect",
    "Terraform",
  ],
  awake: [
    "Network Firewall",
    "Entra ID",
    "CloudFormation",
    "Terraform",
    "AWS Backup",
  ],
};

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projects");

  return (
    <Section className="pt-32">
      <SectionHeader
        title={t("title")}
        headline={t("headline")}
        subtitle={t("subtitle")}
      />

      <div className="grid md:grid-cols-2 gap-8">
        {projectKeys.map((key) => (
          <div
            key={key}
            className="group bg-surface border border-border/50 rounded-lg p-8 hover:border-accent/30 transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <span className="text-xs font-mono text-accent bg-accent/10 px-2.5 py-1 rounded">
                {t(`items.${key}.period`)}
              </span>
            </div>

            <h3 className="text-xl font-bold group-hover:text-accent transition-colors">
              {t(`items.${key}.title`)}
            </h3>
            <p className="text-sm text-accent-light mt-1">
              {t(`items.${key}.client`)}
            </p>

            <p className="mt-4 text-muted leading-relaxed text-sm">
              {t(`items.${key}.description`)}
            </p>

            {/* Tech stack */}
            <div className="mt-6 flex flex-wrap gap-2">
              {techStacks[key].map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-2 py-1 bg-surface-light text-muted rounded border border-border/50"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
