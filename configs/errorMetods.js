module.exports = {
  ErrorNotFound(msg) {
    return error;
  },
  ErrorNotModified(msg) {
    let error = new Error(msg);
    error.status = 'failure';
    error.statusCode = 304;
    error.data = { error: msg};
    return error;
  },
  ErrorBadRequest(msg) {
    let error = new Error(msg);
    error.status = 'failure';
    error.statusCode = 400;
    error.data = { error: msg};
    return error;
  },
  ErrorUnauthorized(msg) {
    let error = new Error(msg);
    error.status = 'failure';
    error.statusCode = 401;
    error.data = { error: msg};
    return error;
  },
  ErrorForbidden(msg) {
    let error = new Error(msg);
    error.status = 'failure';
    error.statusCode = 403;
    error.data = { error: msg};
    return error;
  },
  ErrorNotFound(msg) {
    let error = new Error(msg);
    error.status = 'failure';
    error.statusCode = 404;
    error.data = { error: msg};
    return error;
  },
  ErrorMethodNotAllowed(msg) {
    let error = new Error(msg);
    error.status = 'failure';
    error.statusCode = 405;
    error.data = { error: msg};
    return error;
  },
  ErrorUnprocessableEntity(msg) {
    let error = new Error(msg);
    error.status = 'failure';
    error.statusCode = 422;
    error.data = { error: msg};
    return error;
  },
};
