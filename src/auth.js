'use strict';
// https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html

exports.handler = function (event, context, callback) {
  let token = event.authorizationToken;

  // 値が allow だったらAPI実行するためのIAMポリシーを生成して返す
  if (!token) {
    callback("Unauthorized");   // Return a 401 Unauthorized response
  } else {
    callback(null, generatePolicy('user', (token === 'allow') ? 'Allow' : 'Deny', event));
  }
};

function generatePolicy(principalId, effect, event) {
  const policy = {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: event.methodArn
        }
      ]
    }
  }
  // Optional output with custom properties of the String, Number or Boolean type.
  // policy.context = {
  //     "stringKey": "stringval",
  //     "numberKey": 123,
  //     "booleanKey": true
  // };

  return policy;
}
