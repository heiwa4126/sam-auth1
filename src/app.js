'use strict';
exports.handler = async (event, context) => {

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain"
    },
    body: "Hello from Lambda!"
  };
};
