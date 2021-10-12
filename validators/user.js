const { check } = require('express-validator');

module.exports = {
  registerByEmail: [
    check('firstname').notEmpty().withMessage('is empty'),
    check('lastname').notEmpty().withMessage('is empty'),
    check('email')
      .notEmpty()
      .withMessage('is empty')
      .isEmail()
      .withMessage('must be email'),
    check('password').notEmpty().withMessage('is empty'),
    check('grant_type').notEmpty().withMessage('is empty'),
  ],
  loginByEmail: [
    check('email')
      .notEmpty()
      .withMessage('is empty')
      .isEmail()
      .withMessage('must be email'),
    check('password').notEmpty().withMessage('is empty'),
  ],
};
