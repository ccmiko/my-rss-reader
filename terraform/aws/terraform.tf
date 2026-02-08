terraform {
  backend "s3" {
    bucket       = "tf-state-lock-tfstate"
    key          = "rss-reader.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.30.0"
    }
  }

  required_version = ">= 1.4.0"
}

provider "aws" {
  region = "us-east-1"

  default_tags {
    tags = {
      Name = "rss-reader"
    }
  }
}
