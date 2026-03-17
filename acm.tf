locals {
  # All redirect domain names (apex + www) for certificate SANs
  redirect_sans = flatten([
    for domain, _ in var.redirect_domains : [domain, "www.${domain}"]
  ])
}

resource "aws_acm_certificate" "wordpress_site" {
  domain_name       = var.site_domain
  validation_method = "DNS"

  subject_alternative_names = concat(
    ["${var.site_prefix}.${var.site_domain}"],
    local.redirect_sans
  )

  lifecycle {
    create_before_destroy = true
  }
  provider = aws.ue1
}

# DNS validation for the primary domain (raffaelesollecito.org zone)
resource "aws_route53_record" "wordpress_acm_validation" {
  for_each = {
    for dvo in aws_acm_certificate.wordpress_site.domain_validation_options :
    dvo.domain_name => {
      name    = dvo.resource_record_name
      record  = dvo.resource_record_value
      type    = dvo.resource_record_type
      zone_id = lookup(local.domain_to_zone, dvo.domain_name, var.hosted_zone_id)
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = each.value.zone_id
}

resource "aws_acm_certificate_validation" "wordpress_site" {
  provider                = aws.ue1
  certificate_arn         = aws_acm_certificate.wordpress_site.arn
  validation_record_fqdns = [for record in aws_route53_record.wordpress_acm_validation : record.fqdn]
}

# Map each domain (including www variants) to its hosted zone ID
locals {
  domain_to_zone = merge(
    { (var.site_domain) = var.hosted_zone_id },
    { ("${var.site_prefix}.${var.site_domain}") = var.hosted_zone_id },
    {
      for domain, config in var.redirect_domains :
      domain => config.zone_id
    },
    {
      for domain, config in var.redirect_domains :
      "www.${domain}" => config.zone_id
    }
  )
}
