data "aws_iam_policy_document" "ecs_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs.amazonaws.com", "ecs-tasks.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "wordpress_bucket_access" {
  statement {
    actions   = ["s3:ListBucket"]
    effect    = "Allow"
    resources = [var.wordpress_bucket_arn]
  }
  statement {
    actions   = ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"]
    effect    = "Allow"
    resources = ["${var.wordpress_bucket_arn}/*"]
  }
  statement {
    actions   = ["ec2:DescribeNetworkInterfaces"]
    effect    = "Allow"
    resources = ["*"]
  }
  statement {
    actions   = ["route53:ChangeResourceRecordSets"]
    effect    = "Allow"
    resources = ["arn:aws:route53:::hostedzone/${var.hosted_zone_id}"]
  }
}

resource "aws_iam_policy" "wordpress_bucket_access" {
  name        = "${var.site_name}_WordpressBucketAccess"
  description = "The role that allows Wordpress task to do necessary operations"
  policy      = data.aws_iam_policy_document.wordpress_bucket_access.json
}

resource "aws_iam_role" "wordpress_task" {
  name               = "${var.site_name}_WordpressTaskRole"
  assume_role_policy = data.aws_iam_policy_document.ecs_assume_role_policy.json
}

resource "aws_iam_role_policy_attachment" "wordpress_bucket_access" {
  role       = aws_iam_role.wordpress_task.name
  policy_arn = aws_iam_policy.wordpress_bucket_access.arn
}

resource "aws_iam_role_policy_attachment" "wordpress_role_attachment_ecs" {
  role       = aws_iam_role.wordpress_task.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

resource "aws_iam_role_policy_attachment" "wordpress_role_attachment_cloudwatch" {
  role       = aws_iam_role.wordpress_task.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
}
