# ユーザー情報
resource "aws_dynamodb_table" "users" {
  name           = "users"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "userId"

  attribute {
    name = "userId"
    type = "S"
  }

  deletion_protection_enabled = true

  tags = {
    Name = "rss-reader"
  }
}

# RSSフィード情報
resource "aws_dynamodb_table" "feeds" {
  name           = "feeds"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "userId"
  range_key      = "feedId"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "feedId"
    type = "S"
  }

  deletion_protection_enabled = true

  tags = {
    Name = "rss-reader"
  }
}

# フィード取得実行履歴
resource "aws_dynamodb_table" "executes" {
  name           = "executes"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "userId_feedId"

  attribute {
    name = "userId_feedId"
    type = "S"
  }

  deletion_protection_enabled = true

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  tags = {
    Name = "rss-reader"
  }
}
