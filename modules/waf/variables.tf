variable "site_name" {
  type        = string
  description = "The unique name for this instance of the module."
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
}
