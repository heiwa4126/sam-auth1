'use strict';

function auth(token, event, callback) {
  // 値が allow だったらAPI実行するためのIAMポリシーを生成して返す
  if (!token) {
    callback("Unauthorized");   // Return a 401 Unauthorized response
  } else {
    callback(null, generate('user', (token === 'allow') ? 'Allow' : 'Deny', event));
  }
}

function generate(principalId, effect, event) {
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

module.exports = {
  auth,
  generate
};
