exports.handler = function (event, context, callback) {

  // let authorizationHeader = event.headers.authorization
  let authorizationHeader = event.authorizationToken;

  if (!authorizationHeader) {
    return callback('Unauthorized');
  }

  console.log(authorizationHeader);

  let encodedCreds = authorizationHeader.split(" ")[1]
  let plainCreds = (Buffer.from(encodedCreds, 'base64')).toString().split(':')
  let username = plainCreds[0]
  let password = plainCreds[1]

  console.log(`username=${username}, password=${password}`);

  if (!(username === 'admin' && password === 'password')) return callback('Unauthorized')

  let authResponse = buildAllowAllPolicy(event, username)

  console.log(authResponse);
  callback(null, authResponse)
}

function buildAllowAllPolicy(event, principalId) {
  const policy = {
    principalId: principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: event.methodArn
        }
      ]
    }
  }
  return policy
}
