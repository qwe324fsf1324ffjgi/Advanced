# -----------------------------------------------------------------------------
# Terraform state bootstrap resources
# -----------------------------------------------------------------------------
# These resources are used to host Terraform remote state safely.
# Important: you cannot configure the Terraform backend block to use this S3
# bucket until after these bootstrap resources already exist.
#
# First run:
# 1. terraform init
# 2. terraform apply
#
# After the S3 bucket and DynamoDB table are created, you can add a backend
# configuration that points Terraform to them for remote state and locking.
# -----------------------------------------------------------------------------

locals {
  tf_state_bucket_name = "${local.name_prefix}-tfstate-${data.aws_caller_identity.current.account_id}"
  tf_lock_table_name   = "${local.name_prefix}-tf-locks"
}

resource "aws_s3_bucket" "terraform_state" {
  bucket = local.tf_state_bucket_name

  tags = merge(local.common_tags, {
    Name = local.tf_state_bucket_name
  })
}

resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_dynamodb_table" "terraform_lock" {
  name         = local.tf_lock_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  tags = merge(local.common_tags, {
    Name = local.tf_lock_table_name
  })
}