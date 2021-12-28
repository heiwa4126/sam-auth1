exports.handler = async (event, context) => {

  const response = {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain"
    },
    body: "Hello from Lambda!"
  };
  return response;
};
