#tfsec:ignore:AWS089
resource "aws_cloudwatch_log_group" "wordpress_container" {
  name              = "/aws/ecs/${var.site_name}-serverless-wordpress-container"
  retention_in_days = 7
}

resource "aws_ecs_task_definition" "wordpress_container" {
  family = "${var.site_name}_wordpress"
  container_definitions = templatefile("${path.module}/task-definitions/wordpress.json", {
    db_host                  = aws_rds_cluster.serverless_wordpress.endpoint,
    db_user                  = aws_rds_cluster.serverless_wordpress.master_username,
    db_password              = random_password.serverless_wordpress_password.result,
    db_name                  = aws_rds_cluster.serverless_wordpress.database_name,
    wordpress_image          = "${aws_ecr_repository.serverless_wordpress.repository_url}:latest",
    wp_dest                  = "https://${var.site_prefix}.${var.site_domain}",
    wp_region                = var.s3_region,
    wp_bucket                = var.wordpress_bucket_id,
    container_dns            = "${var.wordpress_subdomain}.${var.site_domain}",
    container_dns_zone       = var.hosted_zone_id,
    container_cpu            = var.ecs_cpu,
    container_memory         = var.ecs_memory
    efs_source_volume        = "${var.site_name}_wordpress_persistent"
    wordpress_admin_user     = var.wordpress_admin_user
    wordpress_admin_password = var.wordpress_admin_password
    wordpress_admin_email    = var.wordpress_admin_email
    site_name                = var.site_name
  })

  cpu                      = var.ecs_cpu
  memory                   = var.ecs_memory
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  execution_role_arn       = aws_iam_role.wordpress_task.arn
  task_role_arn            = aws_iam_role.wordpress_task.arn

  volume {
    name = "${var.site_name}_wordpress_persistent"
    efs_volume_configuration {
      file_system_id     = aws_efs_file_system.wordpress_persistent.id
      transit_encryption = "ENABLED"
      authorization_config {
        access_point_id = aws_efs_access_point.wordpress_efs.id
      }
    }

  }
  tags = {
    "Name" = "${var.site_name}_WordpressECS"
  }

  depends_on = [
    aws_efs_file_system.wordpress_persistent
  ]
}

resource "aws_ecs_service" "wordpress_service" {
  name            = "${var.site_name}_wordpress"
  task_definition = "${aws_ecs_task_definition.wordpress_container.family}:${aws_ecs_task_definition.wordpress_container.revision}"
  cluster         = aws_ecs_cluster.wordpress_cluster.arn
  desired_count   = var.launch
  # iam_role =
  capacity_provider_strategy {
    capacity_provider = "FARGATE_SPOT"
    weight            = "100"
    base              = "1"
  }
  propagate_tags = "SERVICE"
  # Explicitly setting version here: https://stackoverflow.com/questions/62552562/one-or-more-of-the-requested-capabilities-are-not-supported-aws-fargate
  platform_version = "1.4.0"

  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = [aws_security_group.wordpress_security_group.id]
    assign_public_ip = true
  }
}

# TODO: Add option to enable container insights
#tfsec:ignore:AWS090
resource "aws_ecs_cluster" "wordpress_cluster" {
  name = "${var.site_name}_wordpress"
}

resource "aws_ecs_cluster_capacity_providers" "wordpress_cluster" {
  cluster_name       = aws_ecs_cluster.wordpress_cluster.name
  capacity_providers = ["FARGATE_SPOT"]

  default_capacity_provider_strategy {
    capacity_provider = "FARGATE_SPOT"
    weight            = 100
    base              = 1
  }
}
