# my-rss-reader

RSSフィードを定期取得し、新着記事をDiscordのWebhookに通知する個人用RSSリーダー。

## 構成

- `src/index.ts` … Lambdaのエントリポイント（`handler`）。全ユーザーを順に処理する
- `src/handler.ts` … ユーザー単位・フィード単位の処理と通知判定
- `src/model/` … 型定義（users / feeds / executes）
- `src/repo/` … データアクセス層
  - `dynamodb/` が本番用。`local/` はJSONファイルで動かすローカル用
  - 切り替えは `src/repo/index.ts` の export を書き換えて行う（本番は dynamodb のままにすること）
- `src/utils/` … RSSのパース（rss-parser）とDiscord送信
- `terraform/aws/` … Lambda・DynamoDB・EventBridge スケジューラ・S3（tfstate）

## コマンド

- 型チェック: `npx tsc --noEmit`
- Lint: `npx eslint ./src/`
- フォーマット確認: `npx prettier --check ./src/`
- ビルド（Lambda用に `dist/index.cjs` を1ファイル出力）: `npm run build`

変更後は、上の4つがすべて通ることを確認してからコミットする。

## ルール

- 返答、コミットメッセージ、PRの説明は日本語で書く
- `main` へ直接pushしない。ブランチを作ってPRを出す
- AWSの認証情報、Discord Webhook URLなどの秘密情報はコミットしない
- `terraform apply` やAWSへのデプロイは実行しない（terraformのファイル変更は可。適用はオーナーが行う）
- ランタイムは Node.js 24（`volta` の設定と `tsdown.config.ts` の target に合わせる）
- `@aws-sdk/*` はLambda環境にあるため、バンドル対象外（`tsdown.config.ts` の external）
