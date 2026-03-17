# Deployment Guide

## CI/CD Overview

Three GitHub Actions workflows manage the project:

| Workflow | File | Trigger | Purpose |
|----------|------|---------|---------|
| Website | `website.yaml` | Push to `main` (website/**) | Build Next.js, deploy to S3, invalidate CloudFront |
| Terraform | `terraform.yaml` | Push to `main` / PRs | Plan on PRs, apply on merge |
| Test Suite | `testsuite.yaml` | PRs | Linting, security scanning |

All workflows authenticate via **OIDC** — no static AWS credentials.

## Website Deployment

### Automatic (GitHub Actions)

Any push to `main` that modifies files in `website/` triggers:

1. **Build**: `npm install` → `npm run build` (static export)
2. **Upload artifact**: Build output saved for deploy job
3. **Deploy** (production environment):
   - Configure AWS credentials via OIDC
   - Download build artifact
   - S3 sync (3 passes with different cache policies)
   - CloudFront invalidation

### Manual Staging Deploy

```bash
cd website
npm run build
AWS_PROFILE=iamadmin aws s3 sync out/ s3://staging.raffaelesollecito.org/ --delete --region eu-west-1
AWS_PROFILE=iamadmin aws cloudfront create-invalidation --distribution-id E1JC5ON7Q19C1J --paths "/*" --region us-east-1
```

Staging URL: https://d2k2zztrnaobxr.cloudfront.net

## Terraform Deployment

### Automatic (GitHub Actions)

- **On PRs**: Runs `terraform plan`, posts plan as PR comment
- **On merge to main**: Runs `terraform apply -auto-approve`

### Manual (Local)

```bash
# First time: copy and fill in your values
cp local.tfvars.example local.tfvars

# Standard workflow
AWS_PROFILE=iamadmin terraform init
AWS_PROFILE=iamadmin terraform plan -var-file=local.tfvars
AWS_PROFILE=iamadmin terraform apply -var-file=local.tfvars
```

## GitHub Configuration

### Secrets

| Secret | Description |
|--------|-------------|
| `AWS_ACCOUNT_ID` | 480391725083 |
| `HOSTED_ZONE_ID` | Route53 zone for raffaelesollecito.org |
| `MAIN_VPC_ID` | VPC in eu-west-1 |
| `SUBNET_IDS` | JSON array of subnet IDs |

### Variables

| Variable | Value |
|----------|-------|
| `SITE_NAME` | raffaelesollecitowebsite |
| `SITE_DOMAIN` | raffaelesollecito.org |
| `S3_REGION` | eu-west-1 |
| `CLOUDFRONT_ALIASES` | JSON array of all 8 domain aliases |
| `WAF_ENABLED` | false |
| `LAUNCH` | 0 (WordPress off) |
| `REDIRECT_DOMAINS` | JSON map of redirect domain configs |

## WordPress Fallback Deployment

To switch back to WordPress:

1. Set `LAUNCH` variable to `1` in GitHub (or `launch=1` in local.tfvars)
2. Run Terraform apply — ECS Fargate task starts
3. Wait 5-6 minutes for first-time WordPress setup
4. Access `http://wordpress.raffaelesollecito.org`
5. Edit content in WordPress admin
6. Go to WP2Static → Run → Generate Static Site
7. Content is published to the same S3 bucket (overwrites Next.js output)
8. Set `LAUNCH` back to `0` when done

## Rollback

### Website rollback

To revert to a previous version:
1. Find the commit SHA on `main` that last worked
2. Trigger a manual re-run of the `website.yaml` workflow at that commit
3. Or: checkout the commit locally, build, and manual deploy to S3

### Infrastructure rollback

Terraform state is in S3 (`terraform-wordpress-states`). To rollback:
1. Revert the commit on `main`
2. The terraform pipeline will apply the reverted state

## DNS Propagation

After Terraform changes Route53 records or ACM certificates, allow:
- **Route53 changes**: Instant to 60 seconds (TTL-dependent)
- **ACM certificate validation**: 1-10 minutes
- **CloudFront distribution updates**: 5-15 minutes
- **CloudFront Function publish**: 1-2 minutes
