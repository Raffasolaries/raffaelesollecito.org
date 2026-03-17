variable "site_name" {
  type        = string
  description = "The unique name for this instance of the module."
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

variable "main_vpc_id" {
  type        = string
  description = "The VPC ID into which to launch resources."
}

variable "subnet_ids" {
  type        = list(string)
  description = "A list of subnet IDs within the specified VPC where resources will be launched."
}

variable "s3_region" {
  type        = string
  description = "The regional endpoint to use for the S3 bucket for the published static site."
}

variable "hosted_zone_id" {
  type        = string
  description = "The Route53 HostedZone ID to use to create records in."
}

variable "launch" {
  type        = number
  default     = 0
  description = "Number of WordPress tasks to launch (0 or 1)."
}

variable "ecs_cpu" {
  type        = number
  description = "CPU units for the WordPress container definition."
  default     = 256
}

variable "ecs_memory" {
  type        = number
  description = "Memory (MB) for the WordPress container definition."
  default     = 512
}

variable "wordpress_subdomain" {
  type        = string
  description = "The subdomain used for the WordPress container."
  default     = "wordpress"
}

variable "wordpress_admin_user" {
  type        = string
  description = "The username of the default WordPress admin user."
  default     = "supervisor"
}

variable "wordpress_admin_password" {
  type        = string
  description = "The password of the default WordPress admin user."
  sensitive   = true
  default     = ""
}

variable "wordpress_admin_email" {
  type        = string
  description = "The email address of the default WordPress admin user."
  default     = "admin@example.com"
}

variable "snapshot_identifier" {
  type        = string
  description = "To create the RDS cluster from a previous snapshot, specify it by name."
  default     = null
}

variable "wordpress_bucket_arn" {
  type        = string
  description = "The ARN of the S3 bucket where WordPress publishes static content."
}

variable "wordpress_bucket_id" {
  type        = string
  description = "The ID of the S3 bucket where WordPress publishes static content."
}
