const { check } = require('express-validator');

module.exports = {
  create: [
    check('user_id').notEmpty().withMessage('is empty'),
    check('name').notEmpty().withMessage('is empty')
  ],
};
