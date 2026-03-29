output "vpc_id" {
  description = "ID of the main VPC."
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "IDs of the public subnets."
  value       = aws_subnet.public[*].id
}

output "private_app_subnet_ids" {
  description = "IDs of the private application subnets."
  value       = aws_subnet.private_app[*].id
}

output "private_db_subnet_ids" {
  description = "IDs of the private database subnets."
  value       = aws_subnet.private_db[*].id
}

output "backend_security_group_id" {
  description = "Security group ID used by backend workloads and EKS worker nodes."
  value       = aws_security_group.backend.id
}

output "database_security_group_id" {
  description = "Security group ID attached to the PostgreSQL database."
  value       = aws_security_group.database.id
}

output "database_endpoint" {
  description = "Endpoint address of the PostgreSQL database."
  value       = aws_db_instance.postgres.endpoint
}

output "eks_cluster_name" {
  description = "Name of the EKS cluster."
  value       = aws_eks_cluster.main.name
}

output "eks_cluster_endpoint" {
  description = "API server endpoint of the EKS cluster."
  value       = aws_eks_cluster.main.endpoint
}

output "node_group_name" {
  description = "Name of the EKS managed node group."
  value       = aws_eks_node_group.main.node_group_name
}

output "backend_ecr_repository_url" {
  description = "ECR repository URL for backend images."
  value       = aws_ecr_repository.backend.repository_url
}

output "frontend_ecr_repository_url" {
  description = "ECR repository URL for frontend images."
  value       = aws_ecr_repository.frontend.repository_url
}

output "alb_controller_iam_role_arn" {
  description = "IAM role ARN for the AWS Load Balancer Controller service account."
  value       = aws_iam_role.alb_controller.arn
}

output "database_username" {
  description = "Master username for the PostgreSQL database."
  value       = var.database_username
  sensitive   = true
}