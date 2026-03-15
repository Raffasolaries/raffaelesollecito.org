# CLAUDE.md — raffaelesollecito.org

## Project Overview

Terraform infrastructure for [raffaelesollecito.org](https://raffaelesollecito.org) — a serverless static WordPress site on AWS. Originally based on [terraform-aws-serverless-static-wordpress](https://github.com/TechToSpeech/terraform-aws-serverless-static-wordpress) by TechToSpeech.

## Architecture

- **Static site**: S3 + CloudFront (OAC) + CloudFront Function for URL rewriting
- **WordPress management**: ECS Fargate + Aurora Serverless MySQL (on-demand, launch=0/1)
- **Build pipeline**: CodeBuild + ECR for custom WordPress Docker image
- **DNS**: Route53 + ACM (us-east-1 for CloudFront)
- **CI/CD**: GitHub Actions with AWS OIDC (no static credentials)

## Key Commands

```bash
# Local development — copy the example and fill in your values
cp local.tfvars.example local.tfvars

# Init (locally, use AWS_PROFILE=iamadmin)
terraform init

# Plan
terraform plan -var-file=local.tfvars

# Apply
terraform apply -var-file=local.tfvars

# Format
terraform fmt -recursive

# Validate
terraform validate
```

## Secrets Management

All environment-specific values are stored externally — never in git.

**GitHub Secrets** (sensitive infrastructure IDs):
- `AWS_ACCOUNT_ID`, `HOSTED_ZONE_ID`, `MAIN_VPC_ID`, `SUBNET_IDS`

**GitHub Variables** (non-sensitive config):
- `SITE_NAME`, `SITE_DOMAIN`, `S3_REGION`, `CLOUDFRONT_ALIASES`, `WAF_ENABLED`, `LAUNCH`

CI/CD passes these as `TF_VAR_*` environment variables — no var-file needed in pipelines.

For local development, create `local.tfvars` from `local.tfvars.example` (gitignored).

## Project Structure

```
├── provider.tf            # AWS provider + S3 backend
├── main.tf                # Module instantiation
├── variables.tf           # Root variables
├── local.tfvars.example   # Template for local development
├── acm.tf                 # ACM certificate (us-east-1)
├── r53.tf                 # Route53 DNS records
├── ecs.tf                 # ECS cluster, service, task definition
├── ecr.tf                 # ECR repository
├── rds.tf                 # Aurora Serverless cluster
├── modules/
│   ├── cloudfront/        # S3 bucket, CloudFront distribution, OAC, CF Function
│   ├── codebuild/         # Docker build pipeline
│   ├── lambda_slack/      # Slack notifications (Python 3.12)
│   └── waf/               # WAFv2 (optional)
├── content/               # Site analysis and documentation
└── .github/workflows/     # CI/CD pipelines
```

## CI/CD

- **testsuite.yaml**: Runs on PRs — pre-commit, tflint, tfsec, misspell, yamllint
- **terraform.yaml**: Runs terraform plan on PRs (posts plan to PR comment), terraform apply on merge to main (via OIDC)

## Branch Protection

- Required checks: `Terraform Plan`, `test-suite`
- Squash merge only, auto-delete branches
- Branch must be up-to-date with main before merge

## Conventions

- AWS provider `~> 5.0`, Terraform `>= 1.5`
- No hardcoded AWS profiles or credentials — use default credential chain
- S3 backend at `terraform-wordpress-states` bucket
- Feature branches for infrastructure changes, PRs to main
- `*.tfvars` files are gitignored — use GitHub Secrets/Variables for CI
- terraform-docs auto-generates README.md files via pre-commit
