'use strict';
// https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html

const policy = require('./policy.js');

exports.handler = function (event, context, callback) {
  policy.auth(event?.queryStringParameters?.auth, event, callback);
}
