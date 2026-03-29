variable "aws_region" {
  description = "AWS region for all resources."
  type        = string
  default     = "eu-north-1"
}

variable "project_name" {
  description = "Project name used for resource naming and tagging."
  type        = string
  default     = "todoapp"
}

variable "environment" {
  description = "Deployment environment name."
  type        = string
  default     = "prod"
}

variable "owner" {
  description = "Owner tag value for all resources."
  type        = string
  default     = "Zerah"
}

variable "vpc_cidr" {
  description = "CIDR block for the main VPC."
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets."
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_app_subnet_cidrs" {
  description = "CIDR blocks for private application subnets used by EKS worker nodes."
  type        = list(string)
  default     = ["10.0.11.0/24", "10.0.12.0/24"]
}

variable "private_db_subnet_cidrs" {
  description = "CIDR blocks for private database subnets used by RDS."
  type        = list(string)
  default     = ["10.0.21.0/24", "10.0.22.0/24"]
}

variable "availability_zones" {
  description = "Availability Zones used to place subnets."
  type        = list(string)
  default     = ["eu-north-1a", "eu-north-1b"]
}

variable "database_name" {
  description = "Initial PostgreSQL database name."
  type        = string
  default     = "todoapp"
}

variable "database_username" {
  description = "Master username for the PostgreSQL database."
  type        = string
  default     = "todoappadmin"
}

variable "database_password" {
  description = "Master password for the PostgreSQL database."
  type        = string
  sensitive   = true

  validation {
    condition     = length(var.database_password) >= 8
    error_message = "database_password must be at least 8 characters long."
  }
}

variable "database_instance_class" {
  description = "RDS instance class for PostgreSQL."
  type        = string
  default     = "db.t3.micro"
}

variable "eks_cluster_name" {
  description = "Name of the EKS cluster."
  type        = string
  default     = "todoapp-prod-eks"
}

variable "eks_node_desired_size" {
  description = "Desired number of EKS worker nodes."
  type        = number
  default     = 1
}

variable "eks_node_min_size" {
  description = "Minimum number of EKS worker nodes."
  type        = number
  default     = 1
}

variable "eks_node_max_size" {
  description = "Maximum number of EKS worker nodes."
  type        = number
  default     = 1
}