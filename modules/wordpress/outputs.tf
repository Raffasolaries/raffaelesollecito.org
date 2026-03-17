output "ecr_repository_name" {
  value       = aws_ecr_repository.serverless_wordpress.name
  description = "The name of the ECR repository where the WordPress image is stored."
}

output "ecr_repository_url" {
  value       = aws_ecr_repository.serverless_wordpress.repository_url
  description = "The URL of the ECR repository."
}

output "ecs_cluster_arn" {
  value       = aws_ecs_cluster.wordpress_cluster.arn
  description = "The ARN of the ECS cluster running WordPress."
}
