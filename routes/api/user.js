const router = require('express').Router();
const controllers = require('../../controllers/user.controller');
const validators = require('../../validators');

router.post('/register-mail', validators.user.registerByEmail, controllers.onRegisterByEmail);
router.post('/login-email', validators.user.loginByEmail, controllers.onLoginByEmail);
router.post('/refresh-token', controllers.onRefreshToken);

module.exports = router;