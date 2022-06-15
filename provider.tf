terraform {
  required_version = ">= 0.15.1"
  required_providers {
    aws = {
      source = "hashicorp/aws"
      # https://github.com/hashicorp/terraform-provider-aws/blob/main/CHANGELOG.md
      version               = "~> 3.0"
      configuration_aliases = [aws.ue1]
    }
    random = {
      source = "hashicorp/random"
      # https://github.com/hashicorp/terraform-provider-random/blob/main/CHANGELOG.md
      version = "~> 3.1.0"
    }
  }

 backend "s3" {
  bucket = "terraform-wordpress-states"
  key    = "ecs/raffaelesollecito/terraform.tfstate"
  region = "eu-west-1"
  encrypt = true
  shared_credentials_file = "~/.aws/credentials"
  profile = "raffasolaries"
 }
}

provider "aws" {
  alias   = "ue1"
  region  = "us-east-1"
}
