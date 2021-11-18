const router = require('express').Router();
const controllers = require('../../controllers/team.controller');
const validators = require('../../validators');

router.post('/', validators.team.create, controllers.onCreate);

module.exports = router;