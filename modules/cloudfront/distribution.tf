# TODO: Add optional logging for S3 bucket
# TODO: Add optional versioning for S3 bucket
#tfsec:ignore:AWS002 #tfsec:ignore:AWS077
resource "aws_s3_bucket" "wordpress_bucket" {
  bucket        = "${var.site_prefix}.${var.site_domain}"
  force_destroy = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "wordpress_bucket" {
  bucket = aws_s3_bucket.wordpress_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "wordpress_bucket" {
  bucket                  = aws_s3_bucket.wordpress_bucket.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# -----------------------------------------------------------------------------
# Origin Access Control (replaces legacy OAI)
# -----------------------------------------------------------------------------

resource "aws_cloudfront_origin_access_control" "wordpress_distribution" {
  name                              = "${var.site_name}-oac"
  description                       = "${var.site_name} OAC for S3"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# -----------------------------------------------------------------------------
# CloudFront Function (replaces Lambda@Edge for URL rewriting)
# -----------------------------------------------------------------------------

resource "aws_cloudfront_function" "url_rewrite" {
  name    = "${var.site_name}_url_rewrite"
  runtime = "cloudfront-js-2.0"
  comment = "Rewrite directory requests to index.html"
  publish = true
  code    = file("${path.module}/functions/url-rewrite.js")
}

# -----------------------------------------------------------------------------
# CloudFront Distribution
# -----------------------------------------------------------------------------

data "aws_cloudfront_cache_policy" "caching_optimized" {
  name = "Managed-CachingOptimized"
}

#tfsec:ignore:AWS045 #tfsec:ignore:AWS071
resource "aws_cloudfront_distribution" "wordpress_distribution" {
  origin {
    domain_name              = aws_s3_bucket.wordpress_bucket.bucket_regional_domain_name
    origin_id                = "${var.site_name}_WordpressBucket"
    origin_access_control_id = aws_cloudfront_origin_access_control.wordpress_distribution.id
  }

  enabled             = true
  is_ipv6_enabled     = true
  http_version        = "http3"
  comment             = "${var.site_name} Distribution for Wordpress"
  default_root_object = "index.html"
  web_acl_id          = var.waf_acl_arn

  aliases = var.cloudfront_aliases

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "${var.site_name}_WordpressBucket"
    compress         = true

    cache_policy_id = data.aws_cloudfront_cache_policy.caching_optimized.id

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.url_rewrite.arn
    }

    viewer_protocol_policy = "redirect-to-https"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  price_class = var.cloudfront_class

  viewer_certificate {
    minimum_protocol_version = "TLSv1.2_2021" # Supports TLS 1.3 automatically
    acm_certificate_arn      = var.cloudfront_ssl
    ssl_support_method       = "sni-only"
  }
}

# -----------------------------------------------------------------------------
# S3 Bucket Policy — grants CloudFront OAC access
# -----------------------------------------------------------------------------

resource "aws_s3_bucket_policy" "wordpress_bucket" {
  bucket = aws_s3_bucket.wordpress_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipal"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.wordpress_bucket.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.wordpress_distribution.arn
          }
        }
      }
    ]
  })
}
