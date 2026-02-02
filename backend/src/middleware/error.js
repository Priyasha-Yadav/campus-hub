const { error } = require("../utils/response");

const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return error(res, message, status, {
    stack: err.stack,
  });
};

module.exports = errorHandler;
