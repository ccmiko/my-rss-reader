locals {
  lambda_exec_arn = aws_lambda_function.rss_reader.arn
  dynamodb_resources = [
    aws_dynamodb_table.executes.arn,
    aws_dynamodb_table.feeds.arn,
    aws_dynamodb_table.users.arn,
  ]
}

data "aws_iam_policy_document" "lambda_exec_policy" {
  statement {
    actions = [
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:BatchGetItem",
      "dynamodb:BatchWriteItem",
      "dynamodb:Query",
      "dynamodb:Scan",
    ]
    effect    = "Allow"
    resources = local.dynamodb_resources
  }

  statement {
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    effect    = "Allow"
    resources = ["arn:aws:logs:*:*:*"]
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
