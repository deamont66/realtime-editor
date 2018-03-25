const router = require('express').Router();

const validator = require('../middlewares/UserMiddleware');
const controller = require('../controllers/AuthController');

router.delete('/', [
    validator.validateLoggedIn
], controller.deleteSignOut);

/* -- LocalStrategy -- */
router.post('/signIn', [
    validator.validateNotLoggedIn,
    validator.validateSignIn
], controller.postLocalSignIn);

router.post('/', [
    validator.validateNotLoggedIn,
    validator.validateSignUp
], controller.postLocalSignUp);

/* -- CTU OAuth2Strategy --*/
router.get('/ctu', validator.validateNotLoggedIn, controller.getCTUSingIn);
router.get('/ctu/callback', validator.validateNotLoggedIn, controller.getCTUSignInCallback);

module.exports = router;
