const router = require('express').Router();

router.use('/api', require('./api'));
router.use('/locales', require('./locales'));

module.exports = router;
