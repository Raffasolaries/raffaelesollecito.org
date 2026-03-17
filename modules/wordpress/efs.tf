resource "aws_efs_file_system" "wordpress_persistent" {
  encrypted = true
  lifecycle_policy {
    transition_to_ia = "AFTER_7_DAYS"
  }
  tags = {
    "Name" = "${var.site_name}_wordpress_persistent"
  }
}

resource "aws_efs_access_point" "wordpress_efs" {
  file_system_id = aws_efs_file_system.wordpress_persistent.id
}

resource "aws_efs_mount_target" "wordpress_efs" {
  for_each        = toset(var.subnet_ids)
  file_system_id  = aws_efs_file_system.wordpress_persistent.id
  subnet_id       = each.value
  security_groups = [aws_security_group.efs_security_group.id]
}
