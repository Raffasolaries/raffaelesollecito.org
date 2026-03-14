# raffaelesollecito.org — AWS Infrastructure

## Account & Region

- AWS Account: 480391725083
- Primary Region: eu-west-1 (Ireland)
- CloudFront/ACM/Lambda@Edge: us-east-1

## Current Architecture

```
User → Route53 (raffaelesollecito.org)
     → CloudFront (E1QA011ASCYU5O / d34mbna360z1v.cloudfront.net)
       ├── Lambda@Edge (origin-request): URL rewrite /path/ → /path/index.html
       └── S3 Origin (www.raffaelesollecito.org bucket, OAI access)
```

## DNS (Route53 Zone: Z10348702D3SPFDJMEVEN)

| Record | Type | Target |
|--------|------|--------|
| raffaelesollecito.org | A (alias) | CloudFront d34mbna360z1v.cloudfront.net |
| raffaelesollecito.org | AAAA (alias) | CloudFront d34mbna360z1v.cloudfront.net |
| www.raffaelesollecito.org | CNAME | raffaelesollecito.org |
| raffaelesollecito.org | MX | 1 SMTP.GOOGLE.COM |
| wordpress.raffaelesollecito.org | A | 54.74.167.100 (ECS, when running) |

## S3 Bucket

- Name: www.raffaelesollecito.org
- Encryption: AES256
- Public access: fully blocked
- Access: via CloudFront OAI only

## CloudFront Distribution

- ID: E1QA011ASCYU5O
- Domain: d34mbna360z1v.cloudfront.net
- Aliases: raffaelesollecito.org, www.raffaelesollecito.org
- SSL: ACM cert (us-east-1), TLSv1.2_2021, SNI-only
- Default root object: index.html
- Cache: default TTL 600s, max 31536000s
- WAF: disabled
- IPv6: enabled

## ECS/WordPress (legacy, currently off)

- Cluster: raffaelesollecitowebsite_wordpress
- Running tasks: 0 (launch=0)
- RDS: Aurora Serverless v2 MySQL 8.0 (0-1 ACU, auto-pause 300s)
- ECR: raffaelesollecitowebsite-serverless-wordpress

## ACM Certificate

- ARN: arn:aws:acm:us-east-1:480391725083:certificate/b67c69bd-d9d7-42eb-880b-b2e2ba37c244
- Domains: raffaelesollecito.org + www.raffaelesollecito.org
- Valid until: Sep 2026

## Upgrade Plan

1. Replace OAI with Origin Access Control (OAC)
2. Replace Lambda@Edge (Node.js 12.x, deprecated) with CloudFront Function
3. Deploy via GitHub Actions using OIDC (role: github-actions-oidc)
