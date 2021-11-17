const router = require('express').Router();
const controllers = require('../../controllers/user.controller');
const validators = require('../../validators');

router.post('/', validators.user.createUser, controllers.onInsert);
router.get('/:id', controllers.onGetById);

module.exports = router;