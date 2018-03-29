const router = require('express').Router();

const authValidator = require('../../middlewares/AuthMiddleware');
const documentValidator = require('../../middlewares/DocumentMiddleware');
const validator = require('../../middlewares/UserMiddleware');
const controller = require('../../controllers/UserController');


router.get('/', authValidator.validateLoggedIn(), controller.getUser);
router.put('/', [
    authValidator.validateLoggedIn(),
    validator.validateUser()
], controller.putUser);

router.get('/document-settings', authValidator.validateLoggedIn(), controller.getDefaultDocumentSettings);
router.put('/document-settings', [
    authValidator.validateLoggedIn(),
    documentValidator.validateDocumentSettings()
], controller.putDefaultDocumentSettings);

module.exports = router;
