
const router = require('express').Router();
const config = require('../configs');

router.use(`/api/v${config.apiVersion}`, require('./api'));

module.exports = router;
