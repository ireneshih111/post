const headers = require("./headers");

const handleError = (res, message, statusCode = 400) => {
  res.writeHead(statusCode, headers);
  res.write(
    JSON.stringify({
      status: "fail",
      message,
    })
  );
  res.end();
};

module.exports = handleError;
