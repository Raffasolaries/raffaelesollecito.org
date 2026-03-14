# Legacy Lambda@Edge resources are no longer used.
# URL rewriting is now handled by a CloudFront Function (see distribution.tf).
# The resources below are kept commented out for reference during migration.
# Once the OAC + CloudFront Function deployment is confirmed working,
# these can be removed along with the lambda_redirect/ directory.

# data "archive_file" "index_html" {
#   type        = "zip"
#   source_dir  = "${path.module}/lambda_redirect/index_html"
#   output_path = "${path.module}/lambda_redirect/dst/index_html.zip"
# }

# resource "aws_cloudwatch_log_group" "object_redirect" {
#   name              = "/aws/lambda/${var.site_name}_redirect_index_html"
#   retention_in_days = 7
# }

# resource "aws_cloudwatch_log_group" "object_redirect_ue1_local" {
#   name              = "/aws/lambda/us-east-1.${var.site_name}_redirect_index_html"
#   retention_in_days = 7
# }

# resource "aws_cloudwatch_log_group" "object_redirect_ue1" {
#   name              = "/aws/lambda/us-east-1.${var.site_name}_redirect_index_html"
#   retention_in_days = 7
#   provider          = aws.ue1
# }

# resource "aws_lambda_function" "object_redirect" {
#   provider         = aws.ue1
#   filename         = data.archive_file.index_html.output_path
#   function_name    = "${var.site_name}_redirect_index_html"
#   role             = aws_iam_role.lambda-edge.arn
#   handler          = "index.handler"
#   source_code_hash = data.archive_file.index_html.output_base64sha256
#   runtime          = "nodejs12.x"
#   publish          = true
#   memory_size      = 128
#   timeout          = 3
#   depends_on = [
#     aws_cloudwatch_log_group.object_redirect,
#     aws_cloudwatch_log_group.object_redirect_ue1,
#     aws_cloudwatch_log_group.object_redirect_ue1_local
#   ]
# }

# resource "aws_iam_role" "lambda-edge" {
#   name               = "${var.site_name}-lambda-edge-service-role"
#   assume_role_policy = data.aws_iam_policy_document.lambda-edge-service-role.json
# }

# resource "aws_iam_role_policy_attachment" "basic" {
#   role       = aws_iam_role.lambda-edge.name
#   policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
# }

# resource "aws_iam_role_policy" "lambda-edge-cloudwatch-logs" {
#   name   = "${var.site_name}-lambda-edge-cloudwatch-logs"
#   role   = aws_iam_role.lambda-edge.name
#   policy = data.aws_iam_policy_document.lambda-edge-cloudwatch-logs.json
# }
