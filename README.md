# sam-auth1

Lambda オーソライザーのサンプル。

- [sam-auth1](#sam-auth1)
- [デプロイ](#デプロイ)
- [テスト](#テスト)
  - [HTTPヘッダの中身で認証(Tokenオーソライザー)](#httpヘッダの中身で認証tokenオーソライザー)
  - [デフォルトオーソライザーの無効化](#デフォルトオーソライザーの無効化)
  - [TokenオーソライザーでBASIC認証](#tokenオーソライザーでbasic認証)
  - [REQUESTオーソライザー](#requestオーソライザー)
- [削除](#削除)
- [参考](#参考)
  - [BASIC認証のカスタムエラーページ](#basic認証のカスタムエラーページ)
- [その他](#その他)


# デプロイ

SAMなので
```sh
sam build
sam deploy --guided  # --guidedは最初の1回
```

# テスト

OutputのHelloApiのURLに対してcurlでアクセスする。

## HTTPヘッダの中身で認証(Tokenオーソライザー)

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

## TokenオーソライザーでBASIC認証

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


## REQUESTオーソライザー

クエリauthにallowを渡す

```sh
curl https://xxxxxxxxxx.execute-api.ap-northeast-1.amazonaws.com/Prod/hi?auth=allow
# or
curl -G --data-urlencode "auth=allow" https://xxxxxxxxxx.execute-api.ap-northeast-1.amazonaws.com/Prod/hi
```


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

# その他

authのlambdaは非同期ハンドラ(non-async handler)で書かないといけないものなの?

non-async handlerのcallbackは
```javascript
callback(response_error, response_success)
```
らしいのだけど、ドキュメントが見つからない。

auth関数でprincipalIdには何を設定するべき?

> principalId 値には、マッピングテンプレートで $context.authorizer.principalId 変数を使ってアクセスできます。これはバックエンドに値を渡す場合に便利です。

引用元: [Amazon API Gateway Lambda オーソライザーからの出力 - Amazon API Gateway](https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/
api-gateway-lambda-authorizer-output.html)

後段のlambdaで使えるよう渡すだけ。
