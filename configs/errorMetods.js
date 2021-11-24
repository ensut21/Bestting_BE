module.exports = {
  ErrorNotFound(msg) {
    return error;
  },
  ErrorNotModified(msg) {
    let error = new Error(msg);
    error.status = 'Failure';
    error.statusCode = 304;
    error.errorMessage = msg;
    return error;
  },
  ErrorBadRequest(msg) {
    let error = new Error(msg);
    error.status = 'Failure';
    error.statusCode = 400;
    error.errorMessage = msg;
    return error;
  },
  ErrorUnauthorized(msg) {
    let error = new Error(msg);
    error.status = 'Failure';
    error.statusCode = 401;
    error.errorMessage = msg;
    return error;
  },
  ErrorForbidden(msg) {
    let error = new Error(msg);
    error.status = 'Failure';
    error.statusCode = 403;
    error.errorMessage = msg;
    return error;
  },
  ErrorNotFound(msg) {
    let error = new Error(msg);
    error.status = 'Failure';
    error.statusCode = 404;
    error.errorMessage = msg;
    return error;
  },
  ErrorMethodNotAllowed(msg) {
    let error = new Error(msg);
    error.status = 'Failure';
    error.statusCode = 405;
    error.errorMessage = msg;
    return error;
  },
  ErrorUnprocessableEntity(msg) {
    let error = new Error(msg);
    error.status = 'Failure';
    error.statusCode = 422;
    error.errorMessage = msg;
    return error;
  },
  SystemError(msg) {
    let error = new Error(msg);
    error.status = 'Failure';
    error.statusCode = 500;
    error.errorMessage = msg;
    return error;
  },
};
