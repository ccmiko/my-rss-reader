resource "aws_scheduler_schedule" "rss_reader" {
  name        = "rss-reader-scheduler"
  description = "RSSフィード取得を実行するLambdaのスケジュール"

  flexible_time_window {
    mode = "OFF"
  }

  schedule_expression_timezone = "Asia/Tokyo"
  schedule_expression          = "rate(1 hours)"

  target {
    arn      = aws_lambda_function.rss_reader.arn
    role_arn = aws_iam_role.rss_reader_scheduler.arn
    retry_policy {
      maximum_retry_attempts = 0
    }
  }
}
