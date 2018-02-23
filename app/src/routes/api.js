const router = require('express').Router();

router.use('/user', require('./user'));
router.use('/document', require('./document'));

module.exports = router;
