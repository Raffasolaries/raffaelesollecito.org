# CLAUDE.md — raffaelesollecito.org

## Project Overview

Terraform infrastructure for [raffaelesollecito.org](https://raffaelesollecito.org) — a serverless static WordPress site on AWS. Originally based on [terraform-aws-serverless-static-wordpress](https://github.com/TechToSpeech/terraform-aws-serverless-static-wordpress) by TechToSpeech.

## Architecture

- **Static site**: S3 + CloudFront (OAC) + CloudFront Function for URL rewriting
- **WordPress management**: ECS Fargate + Aurora Serverless MySQL (on-demand, launch=0/1)
- **Build pipeline**: CodeBuild + ECR for custom WordPress Docker image
- **DNS**: Route53 + ACM (us-east-1 for CloudFront)
- **CI/CD**: GitHub Actions with AWS OIDC (no static credentials)

## AWS Account

- Account: `480391725083`
- Region: `eu-west-1` (Ireland)
- CloudFront/ACM/Lambda@Edge: `us-east-1`
- Domain: `raffaelesollecito.org`

## Key Commands

```bash
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

## Project Structure

```
├── provider.tf          # AWS provider + S3 backend
├── main.tf              # Module instantiation (cloudfront, codebuild, waf, lambda_slack)
├── variables.tf         # Root variables
├── local.tfvars         # Environment-specific values (gitignored in OIDC repo)
├── acm.tf               # ACM certificate (us-east-1)
├── r53.tf               # Route53 DNS records
├── ecs.tf               # ECS cluster, service, task definition
├── ecr.tf               # ECR repository
├── rds.tf               # Aurora Serverless cluster
├── modules/
│   ├── cloudfront/      # S3 bucket, CloudFront distribution, OAC, CF Function
│   ├── codebuild/       # Docker build pipeline
│   ├── lambda_slack/    # Slack notifications
│   └── waf/             # WAFv2 (optional)
├── content/             # Site analysis and documentation
└── .github/workflows/   # CI/CD pipelines
```

## CI/CD

- **testsuite.yaml**: Runs on PRs — pre-commit, tflint, tfsec, misspell, yamllint
- **testsuite-master.yaml**: Runs on push to master — tflint, tfsec, misspell, yamllint
- **terraform.yaml**: Runs terraform plan on PRs, terraform apply on merge to master (via OIDC)

## Conventions

- AWS provider `~> 5.0`, Terraform `>= 1.5`
- No hardcoded AWS profiles in providers — use default credential chain
- S3 backend at `terraform-wordpress-states` bucket
- Feature branches for infrastructure changes, PRs to master
- terraform-docs auto-generates README.md files via pre-commit
