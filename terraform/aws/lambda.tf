locals {
  function_name = "rss-reader"
}

data "archive_file" "code_zip" {
  type        = "zip"
  source_file = "${path.module}/../../dist/index.cjs"
  output_path = "${path.module}/lambda/function.zip"
}

resource "aws_lambda_function" "rss_reader" {
  function_name = local.function_name
  handler       = "index.handler"
  runtime       = "nodejs24.x"
  role          = aws_iam_role.lambda_exec.arn
  timeout       = 60

  filename    = data.archive_file.code_zip.output_path
  code_sha256 = data.archive_file.code_zip.output_base64sha256

  logging_config {
    log_format = "JSON"
    log_group  = aws_cloudwatch_log_group.rss_reader.name
  }
}

resource "aws_cloudwatch_log_group" "rss_reader" {
  name              = "/aws/lambda/${local.function_name}"
  retention_in_days = 7
}

resource "aws_lambda_permission" "rss_reader_scheduler" {
  statement_id  = "rss-reader-scheduler"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.rss_reader.function_name
  principal     = "scheduler.amazonaws.com"
  source_arn    = aws_scheduler_schedule.rss_reader.arn
}
