import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section, SectionHeader } from "@/components/Section";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, breadcrumbLd } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.projects" });
  return pageMetadata({ locale, path: "projects/", title: t("title"), description: t("description") });
}

const projectKeys = ["gaming", "iot", "fintech", "reevo", "awake"] as const;

const techStacks: Record<(typeof projectKeys)[number], string[]> = {
  gaming: ["Terraform", "EKS", "Aurora", "CloudFront", "WAFv2", "Shield Advanced", "Amazon MQ", "Valkey", "AWS Backup", "Security Hub"],
  iot: ["Bedrock AgentCore", "Lambda", "EventBridge", "DynamoDB", "AWS CDK", "GitLab OIDC", "Cognito", "Entra ID", "React"],
  fintech: ["Control Tower", "IAM Identity Center", "ECS", "AppSync", "S3 Object Lock", "KMS", "Managed Grafana", "Terraform", "Google Workspace"],
  reevo: ["EKS", "ArgoCD", "Karpenter", "Transit Gateway", "Direct Connect", "Network Firewall", "Suricata", "Terraform", "CodeCatalyst"],
  awake: ["Network Firewall", "Entra ID", "AWS Backup", "CloudFormation", "Terraform", "Bitbucket"],
};

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projects");
  const tn = await getTranslations("nav");

  return (
    <Section className="pt-32">
      <JsonLd data={breadcrumbLd(locale, tn("home"), tn("projects"), "projects/")} />
      <SectionHeader title={t("title")} headline={t("headline")} subtitle={t("subtitle")} />

      <div className="grid md:grid-cols-2 gap-8">
        {projectKeys.map((key) => (
          <article key={key} className="group bg-surface border border-border/50 rounded-lg p-8 hover:border-accent/30 transition-all flex flex-col">
            <span className="self-start text-xs font-mono text-accent bg-accent/10 px-2.5 py-1 rounded">{t(`items.${key}.period`)}</span>
            <h2 className="mt-4 text-xl font-bold leading-snug group-hover:text-accent transition-colors">{t(`items.${key}.title`)}</h2>
            <p className="text-sm text-accent-light mt-1">{t(`items.${key}.client`)}</p>
            <p className="mt-4 text-muted leading-relaxed text-sm">{t(`items.${key}.description`)}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {techStacks[key].map((tech) => (
                <span key={tech} className="text-xs px-2 py-1 bg-surface-light text-muted rounded border border-border/50">{tech}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
