const { SystemError } = require("../configs/errorMetods");

function logError(err) {
  console.log(err);
}

function logErrorMiddleware(err, req, res, next) {
  logError(err);
  next(err);
}

function returnError(err, req, res, next) {
  res
    .status(err.statusCode || 500)
    .send(err.errorMessage ? err : SystemError(err));
}

function isOperationalError(error) {
  if (error instanceof BaseError) {
    return error.isOperational;
  }
  return false;
}

module.exports = {
  logError,
  logErrorMiddleware,
  returnError,
  isOperationalError,
};
