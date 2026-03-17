# State migration: flat root resources → modules/wordpress/
# Safe to remove after first successful apply.

# --- ECR ---
moved {
  from = aws_ecr_repository.serverless_wordpress
  to   = module.wordpress.aws_ecr_repository.serverless_wordpress
}

# --- EFS ---
moved {
  from = aws_efs_file_system.wordpress_persistent
  to   = module.wordpress.aws_efs_file_system.wordpress_persistent
}

moved {
  from = aws_efs_access_point.wordpress_efs
  to   = module.wordpress.aws_efs_access_point.wordpress_efs
}

moved {
  from = aws_efs_mount_target.wordpress_efs
  to   = module.wordpress.aws_efs_mount_target.wordpress_efs
}

# --- ECS ---
moved {
  from = aws_ecs_cluster.wordpress_cluster
  to   = module.wordpress.aws_ecs_cluster.wordpress_cluster
}

moved {
  from = aws_ecs_cluster_capacity_providers.wordpress_cluster
  to   = module.wordpress.aws_ecs_cluster_capacity_providers.wordpress_cluster
}

moved {
  from = aws_ecs_service.wordpress_service
  to   = module.wordpress.aws_ecs_service.wordpress_service
}

moved {
  from = aws_ecs_task_definition.wordpress_container
  to   = module.wordpress.aws_ecs_task_definition.wordpress_container
}

moved {
  from = aws_cloudwatch_log_group.wordpress_container
  to   = module.wordpress.aws_cloudwatch_log_group.wordpress_container
}

# --- IAM ---
moved {
  from = aws_iam_role.wordpress_task
  to   = module.wordpress.aws_iam_role.wordpress_task
}

moved {
  from = aws_iam_policy.wordpress_bucket_access
  to   = module.wordpress.aws_iam_policy.wordpress_bucket_access
}

moved {
  from = aws_iam_role_policy_attachment.wordpress_bucket_access
  to   = module.wordpress.aws_iam_role_policy_attachment.wordpress_bucket_access
}

moved {
  from = aws_iam_role_policy_attachment.wordpress_role_attachment_ecs
  to   = module.wordpress.aws_iam_role_policy_attachment.wordpress_role_attachment_ecs
}

moved {
  from = aws_iam_role_policy_attachment.wordpress_role_attachment_cloudwatch
  to   = module.wordpress.aws_iam_role_policy_attachment.wordpress_role_attachment_cloudwatch
}

# --- Security Groups ---
moved {
  from = aws_security_group.wordpress_security_group
  to   = module.wordpress.aws_security_group.wordpress_security_group
}

moved {
  from = aws_security_group_rule.wordpress_sg_ingress_80
  to   = module.wordpress.aws_security_group_rule.wordpress_sg_ingress_80
}

moved {
  from = aws_security_group_rule.wordpress_sg_egress_2049
  to   = module.wordpress.aws_security_group_rule.wordpress_sg_egress_2049
}

moved {
  from = aws_security_group_rule.wordpress_sg_egress_80
  to   = module.wordpress.aws_security_group_rule.wordpress_sg_egress_80
}

moved {
  from = aws_security_group_rule.wordpress_sg_egress_443
  to   = module.wordpress.aws_security_group_rule.wordpress_sg_egress_443
}

moved {
  from = aws_security_group_rule.wordpress_sg_egress_3306
  to   = module.wordpress.aws_security_group_rule.wordpress_sg_egress_3306
}

moved {
  from = aws_security_group.efs_security_group
  to   = module.wordpress.aws_security_group.efs_security_group
}

moved {
  from = aws_security_group_rule.efs_ingress
  to   = module.wordpress.aws_security_group_rule.efs_ingress
}

moved {
  from = aws_security_group.aurora_serverless_group
  to   = module.wordpress.aws_security_group.aurora_serverless_group
}

moved {
  from = aws_security_group_rule.aurora_sg_ingress_3306
  to   = module.wordpress.aws_security_group_rule.aurora_sg_ingress_3306
}

# --- RDS ---
moved {
  from = random_password.serverless_wordpress_password
  to   = module.wordpress.random_password.serverless_wordpress_password
}

moved {
  from = random_id.rds_snapshot
  to   = module.wordpress.random_id.rds_snapshot
}

moved {
  from = aws_db_subnet_group.main_vpc
  to   = module.wordpress.aws_db_subnet_group.main_vpc
}

moved {
  from = aws_cloudwatch_log_group.serverless_wordpress
  to   = module.wordpress.aws_cloudwatch_log_group.serverless_wordpress
}

moved {
  from = aws_rds_cluster.serverless_wordpress
  to   = module.wordpress.aws_rds_cluster.serverless_wordpress
}

moved {
  from = aws_rds_cluster_instance.serverless_wordpress
  to   = module.wordpress.aws_rds_cluster_instance.serverless_wordpress
}
