const router = require('express').Router();

router.use('/users', require('./user'));
router.use('/teams', require('./team'));
router.use('/projects', require('./project'));


module.exports = router;