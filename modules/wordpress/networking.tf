# --- WordPress container security group ---

resource "aws_security_group" "wordpress_security_group" {
  name        = "${var.site_name}_wordpress_sg"
  description = "security group for wordpress"
  vpc_id      = var.main_vpc_id
}

resource "aws_security_group_rule" "wordpress_sg_ingress_80" {
  security_group_id = aws_security_group.wordpress_security_group.id
  type              = "ingress"
  from_port         = 80
  to_port           = 80
  protocol          = "TCP"
  #tfsec:ignore:AWS006
  cidr_blocks = ["0.0.0.0/0"]
  description = "Allow ingress from world to Wordpress container"
}

resource "aws_security_group_rule" "wordpress_sg_egress_2049" {
  security_group_id        = aws_security_group.wordpress_security_group.id
  source_security_group_id = aws_security_group.efs_security_group.id
  type                     = "egress"
  from_port                = 2049
  to_port                  = 2049
  protocol                 = "TCP"
  description              = "Egress to EFS mount from Wordpress container"
}

resource "aws_security_group_rule" "wordpress_sg_egress_80" {
  security_group_id = aws_security_group.wordpress_security_group.id
  type              = "egress"
  from_port         = 80
  to_port           = 80
  protocol          = "TCP"
  #tfsec:ignore:AWS007
  cidr_blocks = ["0.0.0.0/0"]
  description = "Egress from Wordpress container to world on HTTP"
}

resource "aws_security_group_rule" "wordpress_sg_egress_443" {
  security_group_id = aws_security_group.wordpress_security_group.id
  type              = "egress"
  from_port         = 443
  to_port           = 443
  protocol          = "TCP"
  #tfsec:ignore:AWS007
  cidr_blocks = ["0.0.0.0/0"]
  description = "Egress from Wordpress container to world on HTTPS"
}

resource "aws_security_group_rule" "wordpress_sg_egress_3306" {
  security_group_id        = aws_security_group.wordpress_security_group.id
  type                     = "egress"
  from_port                = 3306
  to_port                  = 3306
  protocol                 = "TCP"
  source_security_group_id = aws_security_group.aurora_serverless_group.id
  description              = "Egress from Wordpress container to Aurora Database"
}

# --- EFS security group ---

resource "aws_security_group" "efs_security_group" {
  name        = "${var.site_name}_efs_sg"
  description = "security group for wordpress"
  vpc_id      = var.main_vpc_id
}

resource "aws_security_group_rule" "efs_ingress" {
  security_group_id        = aws_security_group.efs_security_group.id
  type                     = "ingress"
  from_port                = 2049
  to_port                  = 2049
  protocol                 = "TCP"
  source_security_group_id = aws_security_group.wordpress_security_group.id
  description              = "Ingress to EFS mount from Wordpress container"
}

# --- Aurora security group ---

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
