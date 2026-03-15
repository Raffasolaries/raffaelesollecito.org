resource "random_password" "serverless_wordpress_password" {
  length           = 16
  special          = true
  override_special = "!#%&*()-_=+[]<>"
}

resource "aws_security_group" "aurora_serverless_group" {
  name        = "${var.site_domain}_aurora_mysql_sg"
  description = "security group for serverless wordpress mysql aurora"
  vpc_id      = var.main_vpc_id
}

resource "aws_security_group_rule" "aurora_sg_ingress_3306" {
  security_group_id        = aws_security_group.aurora_serverless_group.id
  type                     = "ingress"
  from_port                = 3306
  to_port                  = 3306
  protocol                 = "TCP"
  source_security_group_id = aws_security_group.wordpress_security_group.id
  description              = "Ingress on mySQL port to Aurora Serverless"
}

resource "aws_db_subnet_group" "main_vpc" {
  name       = "${var.site_name}_main"
  subnet_ids = var.subnet_ids

  tags = {
    Name = "${var.site_domain} Subnet group for main VPC"
  }
}

resource "random_id" "rds_snapshot" {
  byte_length = 8
}

resource "aws_cloudwatch_log_group" "serverless_wordpress" {
  name              = "/aws/rds/cluster/${var.site_name}-serverless-wordpress/error"
  retention_in_days = 7
}

# Aurora MySQL 8.0 — migrated from Serverless v1 to provisioned + Serverless v2 scaling
resource "aws_rds_cluster" "serverless_wordpress" {
  vpc_security_group_ids              = [aws_security_group.aurora_serverless_group.id]
  db_subnet_group_name                = aws_db_subnet_group.main_vpc.name
  cluster_identifier                  = "${var.site_name}-serverless-wordpress"
  engine                              = "aurora-mysql"
  engine_version                      = "8.0.mysql_aurora.3.08.2"
  engine_mode                         = "provisioned"
  database_name                       = "wordpress"
  master_username                     = "wp_master"
  enable_http_endpoint                = true
  iam_database_authentication_enabled = false
  master_password                     = random_password.serverless_wordpress_password.result
  backup_retention_period             = 5
  storage_encrypted                   = true

  serverlessv2_scaling_configuration {
    min_capacity             = 0
    max_capacity             = 1
    seconds_until_auto_pause = 300
  }

  skip_final_snapshot       = false
  final_snapshot_identifier = "${var.site_name}-serverless-wordpress-${random_id.rds_snapshot.dec}"
  snapshot_identifier       = var.snapshot_identifier
  depends_on                = [aws_cloudwatch_log_group.serverless_wordpress]

  lifecycle {
    ignore_changes = [engine_version]
  }
}

resource "aws_rds_cluster_instance" "serverless_wordpress" {
  identifier         = "${var.site_name}-serverless-wordpress-instance-1"
  cluster_identifier = aws_rds_cluster.serverless_wordpress.id
  instance_class     = "db.serverless"
  engine             = aws_rds_cluster.serverless_wordpress.engine
  engine_version     = aws_rds_cluster.serverless_wordpress.engine_version
}
