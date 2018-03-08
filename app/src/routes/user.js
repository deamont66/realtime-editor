const router = require('express').Router();

const validator = require('../middlewares/UserMiddleware');
const controller = require('../controllers/UserController');

router.post('/signIn', [
    validator.validateNotLoggedIn,
    validator.validateSignIn
], controller.postSignIn);

router.post('/', [
    validator.validateNotLoggedIn,
    validator.validateSignUp
], controller.postSignUp);


router.get('/', [
    validator.validateLoggedIn
], controller.getUser);

router.put('/', [
    validator.validateLoggedIn
], controller.putUser);

router.delete('/', [
    validator.validateLoggedIn
], controller.deleteSignOut);

router.get('/document-settings', [
    validator.validateLoggedIn
], controller.getDefaultDocumentSettings);

router.put('/document-settings', [
    validator.validateLoggedIn
], controller.putDefaultDocumentSettings);

module.exports = router;
