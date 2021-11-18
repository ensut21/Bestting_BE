const { validationResult } = require('express-validator');

// Import Validators
const user = require('./user');
const team = require('./team');

const validators = {
  user,
  team
};

module.exports = {
  check(req, res, next) {
    let errors = validationResult(req).array();
    if (errors.length == 0) return next();
    let error = new Error(`${errors[0].param}: ${errors[0].msg}`);
    error.status = 422;
    throw error;
  },
  ...validators,
};
