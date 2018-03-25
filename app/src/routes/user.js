const router = require('express').Router();

const validator = require('../middlewares/UserMiddleware');
const controller = require('../controllers/UserController');


router.get('/', [
    validator.validateLoggedIn
], controller.getUser);

router.put('/', [
    validator.validateLoggedIn
], controller.putUser);

router.get('/document-settings', [
    validator.validateLoggedIn
], controller.getDefaultDocumentSettings);

router.put('/document-settings', [
    validator.validateLoggedIn
], controller.putDefaultDocumentSettings);

module.exports = router;
