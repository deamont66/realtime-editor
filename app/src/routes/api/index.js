const router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/user', require('./user'));
router.use('/document', require('./document'));

router.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    err.json = true;
    next(err);
});

module.exports = router;
