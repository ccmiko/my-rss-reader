# RSS Readerを自作しよう！！

- 制限なしで自由に使えるサービスが欲しいので、作ってみる。

## AWS版リソース

- S3
  - terraformのtfstate管理用
- DynamoDB
  - 永続データの保持
- Lambda
  - RSSのデータ取得を行う実体
- Amazon EventBridge スケジューラ
  - RSSのデータ取得の定期実行トリガー

### terraformのtfstate管理用S3バケット作成とterraform管理下へのimport

```shell
TFSTATE_BUCKET="tf-state-lock-tfstate"

aws login
aws s3api create-bucket --bucket $TFSTATE_BUCKET

cd terraform/aws
terraform init
terraform import aws_s3_bucket.terraform_state $TFSTATE_BUCKET
```
