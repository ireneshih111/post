const headers = require("./headers");

const handleSuccess = (res, message = "") => {
  res.writeHead(200, headers);
  res.write(
    JSON.stringify({
      status: "success",
      message,
    })
  );
  res.end();
};

module.exports = handleSuccess;
