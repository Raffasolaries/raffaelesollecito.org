terraform {
  required_version = ">= 1.14"

  required_providers {
    aws = {
      source                = "hashicorp/aws"
      version               = "~> 6.0"
      configuration_aliases = [aws.ue1]
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.8"
    }
  }

  backend "s3" {
    bucket  = "terraform-wordpress-states"
    key     = "ecs/raffaelesollecito/terraform.tfstate"
    region  = "eu-west-1"
    encrypt = true
  }
}

provider "aws" {
  region = "eu-west-1"
}

provider "aws" {
  alias  = "ue1"
  region = "us-east-1"
}
