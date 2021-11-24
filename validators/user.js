const { check } = require('express-validator');

module.exports = {
  createUser: [
    check('first_name').notEmpty(),
    check('last_name').notEmpty()
  ],
};
