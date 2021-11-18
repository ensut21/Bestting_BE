const router = require('express').Router();
const controllers = require('../../controllers/user.controller');
const validators = require('../../validators');

router.get('/', controllers.onGetAll);
router.get('/:id', controllers.onGetById);
router.post('/', validators.user.createUser, controllers.onInsert);
router.patch('/:id', controllers.onUpdate)

module.exports = router;