# CLAUDE.md — raffaelesollecito.org

## Project Overview

Personal website and infrastructure for [raffaelesollecito.org](https://raffaelesollecito.org) — Raffaele Sollecito's trilingual (EN/IT/DE) portfolio, memoir, and legal archive.

The project contains two main components:
1. **Terraform infrastructure** — AWS resources (S3, CloudFront, ECS, Aurora, Route53, ACM)
2. **Next.js website** (`website/`) — static site with EN/IT/DE support, deployed to S3+CloudFront

Originally based on [terraform-aws-serverless-static-wordpress](https://github.com/TechToSpeech/terraform-aws-serverless-static-wordpress) by TechToSpeech. The WordPress CMS is still available as a fallback (toggle `launch=1`), but the primary site is now a Next.js static export.

## Architecture

- **Static site**: S3 (`www.raffaelesollecito.org`) + CloudFront (OAC) + CloudFront Function
- **Website framework**: Next.js 16, React 19, Tailwind CSS v4, next-intl for i18n
- **WordPress fallback**: ECS Fargate + Aurora Serverless MySQL (on-demand, `launch=0/1`)
- **Build pipeline**: CodeBuild + ECR for custom WordPress Docker image
- **DNS**: Route53 (4 hosted zones) + ACM (us-east-1 for CloudFront)
- **CI/CD**: GitHub Actions with AWS OIDC (no static credentials)
- **Domain redirects**: All alternate domains redirect via CloudFront Function

## AWS Account

- **Account**: 480391725083
- **Region**: eu-west-1 (Ireland)
- **Local profile**: `iamadmin`
- **OIDC role**: `github-actions-oidc`

## Domains

| Domain | Purpose | DNS |
|--------|---------|-----|
| `raffaelesollecito.org` | Primary website | Route53 → CloudFront |
| `www.raffaelesollecito.org` | 301 → `raffaelesollecito.org` | Route53 → CloudFront |
| `raffaelesollecito.com` + www | 301 → `raffaelesollecito.org` | Route53 → CloudFront |
| `raffaelesollecito.it` + www | 301 → `raffaelesollecito.org` | Route53 → CloudFront |
| `suntickets.it` + www | 301 → `/archive/` (locale-aware) | Route53 → CloudFront |
| `italianfinestone.com` | Separate hosted zone (not redirected) | Route53 |
| `ivorycleanersflorida.com` | Separate hosted zone (not redirected) | Route53 |

## Key Commands

```bash
# --- Terraform (local, use AWS_PROFILE=iamadmin) ---
cp local.tfvars.example local.tfvars  # Fill in your values
terraform init
terraform plan -var-file=local.tfvars
terraform apply -var-file=local.tfvars
terraform fmt -recursive
terraform validate

# --- Website (local development) ---
cd website
npm install
npm run dev          # Dev server on localhost:3000
npm run build        # Static export to out/

# --- Manual staging deploy ---
cd website
npm run build
AWS_PROFILE=iamadmin aws s3 sync out/ s3://staging.raffaelesollecito.org/ --delete --region eu-west-1
AWS_PROFILE=iamadmin aws cloudfront create-invalidation --distribution-id E1JC5ON7Q19C1J --paths "/*" --region us-east-1
```

## Secrets Management

All environment-specific values are stored externally — never in git.

**GitHub Secrets** (sensitive):
- `AWS_ACCOUNT_ID`, `HOSTED_ZONE_ID`, `MAIN_VPC_ID`, `SUBNET_IDS`

**GitHub Variables** (non-sensitive):
- `SITE_NAME`, `SITE_DOMAIN`, `S3_REGION`, `CLOUDFRONT_ALIASES`, `WAF_ENABLED`, `LAUNCH`, `REDIRECT_DOMAINS`

CI/CD passes these as `TF_VAR_*` environment variables. For local dev, use `local.tfvars` (gitignored).

## Project Structure

```
├── provider.tf                # AWS provider + S3 backend
├── main.tf                    # Module instantiation
├── variables.tf               # Root variables (incl. redirect_domains)
├── acm.tf                     # ACM certificate with SANs for all domains
├── r53.tf                     # Route53 records (primary + redirects)
├── ecs.tf                     # ECS cluster, service, task definition
├── ecr.tf                     # ECR repository
├── rds.tf                     # Aurora Serverless cluster
├── modules/
│   ├── cloudfront/            # S3 bucket, CloudFront, OAC, CF Function
│   │   └── functions/url-rewrite.js  # Domain redirects + URL rewriting
│   ├── codebuild/             # Docker build pipeline
│   ├── lambda_slack/          # Slack notifications
│   └── waf/                   # WAFv2 (optional)
├── website/                   # Next.js website source
│   ├── src/app/[locale]/      # Page components (EN/IT/DE)
│   ├── src/components/        # Shared components (Header, Footer, ThemeToggle)
│   ├── src/messages/          # Translation files (en.json, it.json, de.json)
│   ├── src/i18n/              # next-intl configuration
│   ├── src/lib/site.ts        # SITE_URL, routes, pageMetadata() (canonical + hreflang), breadcrumbLd()
│   ├── src/app/sitemap.ts     # /sitemap.xml with hreflang alternates (force-static)
│   ├── src/app/robots.ts      # /robots.txt (allows AI crawlers)
│   ├── src/app/not-found.tsx  # Trilingual 404 → out/404.html (CloudFront custom_error_response)
│   ├── public/                # Static assets (images, icons, SEO files)
│   │   ├── images/            # Photos, book covers, archive assets
│   │   ├── documents/         # Legal PDFs (gitignored, synced from S3)
│   │   ├── llms.txt           # GEO: machine-readable identity + preferred citation
│   │   └── og-image.png       # Open Graph social preview
│   └── package.json
├── docs/                      # Project documentation
├── .github/workflows/
│   ├── website.yaml           # Build + deploy Next.js to S3
│   ├── terraform.yaml         # Plan on PRs, apply on merge
│   ├── testsuite.yaml         # Pre-commit, tflint, tfsec, misspell, yamllint
│   └── testsuite-master.yaml  # Same checks on main
└── CLAUDE.md                  # This file
```

## CI/CD Pipelines

| Workflow | Trigger | Jobs |
|----------|---------|------|
| `website.yaml` | Push to `main` (website/** paths) | Build → Deploy to S3 → Invalidate CloudFront |
| `terraform.yaml` | Push to `main` / PRs | Plan (+ PR comment) → Apply (on merge) |
| `testsuite.yaml` | PRs | pre-commit, tflint, tfsec, misspell, yamllint |

## Website Details

- **Framework**: Next.js 16 with App Router, static export (`output: 'export'`)
- **i18n**: `next-intl` with `[locale]` path-based routing (EN/IT/DE)
- **Styling**: Tailwind CSS v4 with `@theme inline`, CSS custom properties for dark/light mode
- **Theme**: Dark/light toggle with localStorage persistence and flash-free inline script
- **Params pattern**: `params: Promise<{ locale: string }>` (Next.js 16 async params)
- **Node**: v25 in CI

### Pages

Home, About, Experience, Projects (`/projects/`, nav label "Work"), Family, Books (`/books/` — Honor Bound + Un passo fuori dalla notte; `/book/` 301s here), The Case (`/case/` — timeline + FAQ, FAQPage schema), Documents (legal archive), Contact, Archive (Memories IT / SunTickets / BeOnMemories). Printable résumé lives on a separate GitHub Pages site: https://resume.raffaelesollecito.org (repo `Raffasolaries/raffasolaries.github.io`).

### Legal Documents

29 PDF/DOCX files (~93MB) are **not in git** — they're gitignored at `website/public/documents/`. They already exist on the production S3 bucket from the old WordPress site and are preserved by the deploy pipeline's `--exclude "documents/*"` flag.

## CloudFront Function

The single CloudFront Function (`url-rewrite.js`) handles:
1. **www → non-www** redirect for `raffaelesollecito.org`
2. **Domain redirects** for `.com`, `.it` variants → `raffaelesollecito.org`
3. **suntickets.it** → `/archive/` with `Accept-Language` locale detection
4. **Canonical redirects**: `/` → 302 `/{locale}/` (Accept-Language); `/path` → 301 `/path/`; `/{locale}/book/` → `/{locale}/books/`; legacy WordPress slugs (`/honor-bound/`, `/documenti/`, `/progetti/`, `/famiglia-e-amici/`, `/blog-processo/…`) → 301 to the new localized routes
5. **URL rewriting**: `/path/` → `/path/index.html`

CloudFront also maps origin 403/404 → `/404.html` and attaches `aws_cloudfront_response_headers_policy.security` (HSTS, nosniff, DENY, referrer, permissions policy).

## WordPress Fallback

The ECS WordPress setup is still fully functional. To use it:
1. Set `launch=1` in GitHub Variables (or local.tfvars)
2. Run Terraform apply — ECS task starts on Fargate Spot
3. WordPress becomes available at `http://wordpress.raffaelesollecito.org`
4. Edit content, then use WP2Static to publish to the same S3 bucket
5. Set `launch=0` when done to stop the container

Both systems write to the same S3 bucket — WordPress output overwrites Next.js output and vice versa.

## Branch Protection

- Required checks: `Terraform Plan`, `test-suite`
- Squash merge only, auto-delete branches
- Branch must be up-to-date with main before merge

## Conventions

- AWS provider `~> 6.0`, Terraform `>= 1.14`, Random `~> 3.8`
- No hardcoded AWS profiles or credentials — use default credential chain
- S3 backend at `terraform-wordpress-states` bucket
- Feature branches for infrastructure changes, PRs to main
- `*.tfvars` files are gitignored — use GitHub Secrets/Variables for CI
- terraform-docs auto-generates README.md via pre-commit
- NEVER mention current Aspect Solutions clients by name on website or public content (describe them: "global gaming publisher", "IoT semiconductor company", "FCA-regulated fintech"). Past clients (ReeVo, AWAKE Mobility) and past employers may be named.
- Every page.tsx exports `generateMetadata` built with `pageMetadata()` from `src/lib/site.ts` and reads its title/description from `seo.<page>` in the message files. Never set canonical/OG in the layout.
- The case page states facts only (dates, courts, outcomes) and names Meredith Kercher respectfully; never editorialize about other people involved. Book quotes must be real jacket/text quotes — never invent one.
- GA4 / Search Console / Bing tokens come from GitHub Variables `GA_MEASUREMENT_ID`, `GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION` (see `docs/seo-analytics-setup.md`).

## S3 Buckets (Active)

| Bucket | Purpose |
|--------|---------|
| `www.raffaelesollecito.org` | Production website (Terraform managed) |
| `staging.raffaelesollecito.org` | Staging preview |
| `terraform-wordpress-states` | Terraform S3 backend |
| `raffaelesollecitowebsite-build` | CodeBuild artifacts |
| `drive-archive-raffasolaries` | Personal archive (source for images) |
| `www.raffaelesollecito.org-backup-2026-03-16` | WordPress backup snapshot |
| `aws-cloudtrail-logs-480391725083-*` | CloudTrail audit logs |
