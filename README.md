# sam-auth1

Lambda TOKEN オーソライザーのサンプル。

- [sam-auth1](#sam-auth1)
- [デプロイ](#デプロイ)
- [テスト](#テスト)
  - [HTTPヘッダの中身で認証](#httpヘッダの中身で認証)
  - [デフォルトオーソライザーの無効化](#デフォルトオーソライザーの無効化)
  - [BASIC認証](#basic認証)
- [削除](#削除)
- [参考](#参考)
  - [BASIC認証のカスタムエラーページ](#basic認証のカスタムエラーページ)

# デプロイ

SAMなので
```sh
sam build
sam deploy --guided  # --guidedは最初の1回
```

# テスト

OutputのHelloApiのURLに対してcurlでアクセスする。

## HTTPヘッダの中身で認証

/hello/は Auth:ヘッダに `allow` で認証される。

```sh
curl -H "Auth: allow" https://xxxxxxxxxx.execute-api.ap-northeast-1.amazonaws.com/Prod/hello/
```

テストのためにToken Sourceをデフォルトの"Authorization"から"Auth"に変えてある。(スペルもめんどくさいし)

## デフォルトオーソライザーの無効化

/goodbye/は認証不要
```sh
curl https://xxxxxxxxxx.execute-api.ap-northeast-1.amazonaws.com/Prod/goodbye/
```

`Authorizer: NONE`
で
デフォルトオーソライザーを無効化するテスト。

## BASIC認証

/basic/はBASIC認証

```sh
curl -u admin:password https://xxxxxxxxxx.execute-api.ap-northeast-1.amazonaws.com/Prod/basic/
```

通常だと WWW-Authenticate: ヘッダが返せないのでブラウザで使えないが
Gateway Responsesをカスタマイズして、
`WWW-Authenticate: Basic realm=xxxxx`
を返すようにしたのでブラウザで試してみてください。

ただし副作用として/hello/まで
`WWW-Authenticate: Basic`
が帰ってるので、ごめんなさい。


# 削除

```sh
sam delete
```


# 参考

* [LambdaTokenAuthorizer - AWS Serverless Application Model](https://docs.aws.amazon.com/ja_jp/serverless-application-model/latest/developerguide/sam-property-api-lambdatokenauthorizer.html)
* [LambdaTokenAuthorizationIdentity - AWS Serverless Application Model](https://docs.aws.amazon.com/ja_jp/serverless-application-model/latest/developerguide/sam-property-api-lambdatokenauthorizationidentity.html)
* [API Gateway Lambda オーソライザーを使用する - Amazon API Gateway](https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html)


LambdaTokenAuthorizationIdentityの
Header: に対するドキュメントが無い
(けど動くし、設定できてコンソールからも見える)。

同様に
Token Validationに指定できるのは正規表現らしいけど、
ドキュメントが見つからない。

## BASIC認証のカスタムエラーページ

* [カスタマイズされたレスポンスの例 - AWS Serverless Application Model](https://docs.aws.amazon.com/ja_jp/serverless-application-model/latest/developerguide/serverless-controlling-access-to-apis-customize-response.html)
* [Using Basic Authentication with AWS API Gateway and Lambda - Cloudmailin](https://www.cloudmailin.com/blog/basic_auth_with_aws_lambda)

Token Validationを有効にすると、
Custom Gateway Responsesが効かなくなる...
