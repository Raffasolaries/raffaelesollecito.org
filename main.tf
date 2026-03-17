module "cloudfront" {
  source             = "./modules/cloudfront"
  site_name          = var.site_name
  site_domain        = var.site_domain
  cloudfront_ssl     = aws_acm_certificate.wordpress_site.arn
  cloudfront_aliases = var.cloudfront_aliases
  cloudfront_class   = var.cloudfront_class
  waf_acl_arn        = var.waf_enabled ? module.waf[0].waf_acl_arn : null

  providers = {
    aws.ue1 = aws.ue1
  }

  depends_on = [
    aws_acm_certificate_validation.wordpress_site,
    module.waf,
  ]
}

module "wordpress" {
  source = "./modules/wordpress"

  site_name                = var.site_name
  site_domain              = var.site_domain
  site_prefix              = var.site_prefix
  main_vpc_id              = var.main_vpc_id
  subnet_ids               = var.subnet_ids
  s3_region                = var.s3_region
  hosted_zone_id           = var.hosted_zone_id
  launch                   = var.launch
  ecs_cpu                  = var.ecs_cpu
  ecs_memory               = var.ecs_memory
  wordpress_subdomain      = var.wordpress_subdomain
  wordpress_admin_user     = var.wordpress_admin_user
  wordpress_admin_password = var.wordpress_admin_password
  wordpress_admin_email    = var.wordpress_admin_email
  snapshot_identifier      = var.snapshot_identifier
  wordpress_bucket_arn     = module.cloudfront.wordpress_bucket_arn
  wordpress_bucket_id      = module.cloudfront.wordpress_bucket_id
}

module "codebuild" {
  source                   = "./modules/codebuild"
  site_name                = var.site_name
  site_domain              = var.site_domain
  codebuild_bucket         = "${var.site_name}-build"
  main_vpc_id              = var.main_vpc_id
  wordpress_ecr_repository = module.wordpress.ecr_repository_name
  aws_account_id           = var.aws_account_id
  container_memory         = var.ecs_memory
}

module "waf" {
  count         = var.waf_enabled ? 1 : 0
  source        = "./modules/waf"
  site_name     = var.site_name
  waf_acl_rules = var.waf_acl_rules

  providers = {
    aws.ue1 = aws.ue1
  }
}

module "lambda_slack" {
  count           = length(var.slack_webhook) > 5 ? 1 : 0
  source          = "./modules/lambda_slack"
  site_name       = var.site_name
  slack_webhook   = var.slack_webhook
  ecs_cluster_arn = module.wordpress.ecs_cluster_arn
}
