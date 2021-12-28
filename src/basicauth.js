'use strict';
const policy = require('./policy.js');

exports.handler = function (event, context, callback) {

  let authorizationHeader = event.authorizationToken;

  if (!authorizationHeader) {
    return callback('Unauthorized');
  }

  // admin:password だけでいいなら
  // authorizationHeader == 'Basic YWRtaW46cGFzc3dvcmQ='
  // で十分。
  let encodedCreds = authorizationHeader.split(" ")[1];
  let plainCreds = (Buffer.from(encodedCreds, 'base64')).toString().split(':');
  let username = plainCreds[0];
  let password = plainCreds[1];
  //console.log(`username=${username}, password=${password}`);
  if (username !== 'admin' || password !== 'password') {
    return callback('Unauthorized');
  }

  callback(null, policy.generate(username, 'Allow', event));
}
