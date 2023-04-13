locals {
  s3_origin_id = "files-processors-frontend"
}

resource "aws_cloudfront_origin_access_control" "origin_access_control" {
  name                              = "origin-access-control-files-processor-frontend"
  description                       = "CloudFront origin access control for Files Processors frontend"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_s3_bucket" "frontend" {
  bucket        = local.domain_name
  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "frontend_public_access" {
  bucket = aws_s3_bucket.frontend.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

data "aws_iam_policy_document" "frontend_s3_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.frontend.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "ForAnyValue:StringEquals"
      variable = "AWS:SourceArn"
      values   = ["${aws_cloudfront_distribution.frontend_distribution.arn}"]
    }
  }
}

resource "aws_s3_bucket_policy" "frontend_bucket_policy" {
  bucket = aws_s3_bucket.frontend.id
  policy = data.aws_iam_policy_document.frontend_s3_policy.json
}


resource "aws_cloudfront_distribution" "frontend_distribution" {
  comment = "CloudFront Distribution for Files Processors frontend"
  origin {
    domain_name              = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id                = local.s3_origin_id
    origin_access_control_id = aws_cloudfront_origin_access_control.origin_access_control.id
  }

  default_root_object = "index.html"
  enabled             = "true"
  is_ipv6_enabled     = "true"
  wait_for_deployment = "false"
  http_version        = "http2"
  aliases             = ["${local.domain_name}"]
  price_class         = "PriceClass_100" // Only in EU and North America 

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  default_cache_behavior {
    viewer_protocol_policy = "redirect-to-https"
    compress               = "true"
    target_origin_id       = local.s3_origin_id

    forwarded_values {
      query_string = "false"

      cookies {
        forward = "none"
      }
    }

    allowed_methods = ["GET", "HEAD"]
    cached_methods  = ["GET", "HEAD"]
  }

  viewer_certificate {
    cloudfront_default_certificate = false
    acm_certificate_arn            = data.aws_acm_certificate.main_certificate.arn
    ssl_support_method             = "sni-only"
    minimum_protocol_version       = "TLSv1.2_2019"
  }
}


