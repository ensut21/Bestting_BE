const router = require('express').Router();

router.use('/users', require('./user'));
router.use('/teams', require('./team'));


module.exports = router;