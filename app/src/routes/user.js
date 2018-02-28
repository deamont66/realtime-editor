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

router.delete('/', [
    validator.validateLoggedIn
], controller.deleteSignOut);

module.exports = router;
