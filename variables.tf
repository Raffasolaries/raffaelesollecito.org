variable "aws_account_id" {
  type        = string
  description = "The AWS account ID into which resources will be launched."
}

variable "site_name" {
  type        = string
  description = "The unique name for this instance of the module."
  validation {
    condition     = can(regex("^[0-9A-Za-z]+$", var.site_name))
    error_message = "For site_name only a-z, A-Z and 0-9 are allowed."
  }
}

variable "site_domain" {
  type        = string
  description = "The site domain name to configure (without any subdomains such as 'www')."
}

variable "site_prefix" {
  type        = string
  description = "The subdomain prefix of the website domain."
  default     = "www"
}

variable "hosted_zone_id" {
  type        = string
  description = "The Route53 HostedZone ID to use to create records in."
}

variable "main_vpc_id" {
  type        = string
  description = "The VPC ID into which to launch resources."
  validation {
    condition     = length(var.main_vpc_id) > 4 && substr(var.main_vpc_id, 0, 4) == "vpc-"
    error_message = "The main_vpc_id value must be a valid VPC id, starting with \"vpc-\"."
  }
}

variable "subnet_ids" {
  type        = list(string)
  description = "A list of subnet IDs within the specified VPC where resources will be launched."
}

variable "s3_region" {
  type        = string
  description = "The regional endpoint to use for the S3 bucket for the published static site."
}

variable "cloudfront_aliases" {
  type        = list(string)
  description = "The domain and sub-domain aliases to use for the CloudFront distribution."
  default     = []
}

variable "cloudfront_class" {
  type        = string
  description = "The price class for the distribution. One of: PriceClass_All, PriceClass_200, PriceClass_100."
  default     = "PriceClass_All"
}

variable "waf_enabled" {
  type        = bool
  description = "Flag to enable default WAF configuration in front of CloudFront."
  default     = false
}

variable "waf_acl_rules" {
  type = list(object({
    name                       = string
    priority                   = number
    managed_rule_group_name    = string
    vendor_name                = string
    cloudwatch_metrics_enabled = bool
    metric_name                = string
    sampled_requests_enabled   = bool
  }))
  description = "List of WAF rules to apply."
  default = [
    {
      name                       = "AWS-AWSManagedRulesAmazonIpReputationList"
      priority                   = 0
      managed_rule_group_name    = "AWSManagedRulesAmazonIpReputationList"
      vendor_name                = "AWS"
      cloudwatch_metrics_enabled = true
      metric_name                = "AWS-AWSManagedRulesAmazonIpReputationList"
      sampled_requests_enabled   = true
    },
    {
      name                       = "AWS-AWSManagedRulesKnownBadInputsRuleSet"
      priority                   = 1
      managed_rule_group_name    = "AWSManagedRulesKnownBadInputsRuleSet"
      vendor_name                = "AWS"
      cloudwatch_metrics_enabled = true
      metric_name                = "AWS-AWSManagedRulesKnownBadInputsRuleSet"
      sampled_requests_enabled   = true
    },
    {
      name                       = "AWS-AWSManagedRulesBotControlRuleSet"
      priority                   = 2
      managed_rule_group_name    = "AWSManagedRulesBotControlRuleSet"
      vendor_name                = "AWS"
      cloudwatch_metrics_enabled = true
      metric_name                = "AWS-AWSManagedRulesBotControlRuleSet"
      sampled_requests_enabled   = true
    },
  ]
}

# --- ECS / WordPress ---

variable "launch" {
  type        = number
  default     = 0
  description = "Number of Wordpress tasks to launch (0 or 1). Toggle to start/stop the management session."
  validation {
    condition     = var.launch >= 0 && var.launch <= 1
    error_message = "Must be 0 or 1."
  }
}

variable "ecs_cpu" {
  type        = number
  description = "CPU units for the Wordpress container definition."
  default     = 256
}

variable "ecs_memory" {
  type        = number
  description = "Memory (MB) for the Wordpress container definition."
  default     = 512
}

variable "wordpress_subdomain" {
  type        = string
  description = "The subdomain used for the Wordpress container."
  default     = "wordpress"
}

variable "wordpress_admin_user" {
  type        = string
  description = "The username of the default Wordpress admin user."
  default     = "supervisor"
}

variable "wordpress_admin_password" {
  type        = string
  description = "The password of the default Wordpress admin user."
  sensitive   = true
  default     = ""
}

variable "wordpress_admin_email" {
  type        = string
  description = "The email address of the default Wordpress admin user."
  default     = "admin@example.com"
}

variable "slack_webhook" {
  type        = string
  description = "The Slack webhook URL where ECS EventBridge notifications will be sent."
  default     = ""
  sensitive   = true
}

variable "snapshot_identifier" {
  type        = string
  description = "To create the RDS cluster from a previous snapshot, specify it by name."
  default     = null
}
