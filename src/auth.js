exports.handler = function(event, context, callback) {
  // https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html
  console.log(event);
  let token = event.authorizationToken;
  console.log(token);
  // 値が allow だったらAPI実行するためのIAMポリシーを生成して返す
  if (token === undefined ) {
    callback("Unauthorized");   // Return a 401 Unauthorized response
  } else {
    switch (token) {
    case 'allow':
      callback(null, generatePolicy('user', 'Allow', event.methodArn));
      break;
    case 'unauthorized':
      callback("Unauthorized");   // Return a 401 Unauthorized response
      break;
    default:
      callback(null, generatePolicy('user', 'Deny', event.methodArn));
    }
  }
};

// IAMポリシーを生成し返却します
const generatePolicy = function(principalId, effect, resource) {

  let authResponse = {};

  authResponse.principalId = principalId;
  if (effect && resource) {
    let policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    let statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  // // Optional output with custom properties of the String, Number or Boolean type.
  // authResponse.context = {
  //     "stringKey": "stringval",
  //     "numberKey": 123,
  //     "booleanKey": true
  // };
  return authResponse;
}
