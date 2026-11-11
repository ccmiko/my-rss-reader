locals {
  lambda_exec_arn = aws_lambda_function.rss_reader.arn
}

# Lambdaには、コードが実際に使う操作だけを許可する
data "aws_iam_policy_document" "lambda_exec_policy" {
  # users: 全ユーザーの取得（src/repo/dynamodb/users.ts）
  statement {
    sid       = "UsersRead"
    actions   = ["dynamodb:Scan"]
    effect    = "Allow"
    resources = [aws_dynamodb_table.users.arn]
  }

  # feeds: ユーザー単位のフィード取得（src/repo/dynamodb/feeds.ts）
  statement {
    sid       = "FeedsRead"
    actions   = ["dynamodb:Query"]
    effect    = "Allow"
    resources = [aws_dynamodb_table.feeds.arn]
  }

  # executes: 実行履歴の読み書き（src/repo/dynamodb/executes.ts）
  statement {
    sid = "ExecutesReadWrite"
    actions = [
      "dynamodb:Query",
      "dynamodb:BatchGetItem",
      "dynamodb:PutItem",
      "dynamodb:BatchWriteItem",
    ]
    effect    = "Allow"
    resources = [aws_dynamodb_table.executes.arn]
  }

  # ロググループはTerraformで作成済み（lambda.tf）のため、CreateLogGroupは不要
  statement {
    sid = "WriteLogs"
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    effect    = "Allow"
    resources = ["${aws_cloudwatch_log_group.rss_reader.arn}:*"]
  }
}

resource "aws_iam_policy" "lambda_exec_policy" {
  name   = "lambda_exec_policy"
  policy = data.aws_iam_policy_document.lambda_exec_policy.json
}

resource "aws_iam_role_policy_attachment" "dynamodb_policy_attachment" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.lambda_exec_policy.arn
}

data "aws_iam_policy_document" "rss_reader_scheduler_policy" {
  statement {
    actions = [
      "lambda:InvokeFunction",
    ]
    effect    = "Allow"
    resources = [local.lambda_exec_arn]
  }
}

resource "aws_iam_policy" "rss_reader_scheduler_policy" {
  name   = "rss_reader_scheduler_policy"
  policy = data.aws_iam_policy_document.rss_reader_scheduler_policy.json
}

resource "aws_iam_role_policy_attachment" "rss_reader_scheduler_policy_attachment" {
  role       = aws_iam_role.rss_reader_scheduler.name
  policy_arn = aws_iam_policy.rss_reader_scheduler_policy.arn
}
