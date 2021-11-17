const { check } = require('express-validator');

module.exports = {
  createUser: [
    check('first_name').notEmpty().withMessage('is empty'),
    check('last_name').notEmpty().withMessage('is empty')
  ],
};
