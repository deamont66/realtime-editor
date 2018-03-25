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

/* -- Google OAuth2Strategy --*/
router.get('/google', validator.validateNotLoggedIn, controller.getGoogleSignIn);
router.get('/google/callback', validator.validateNotLoggedIn, controller.getGoogleSignInCallback);

/* -- Facebook OAuth2Strategy --*/
router.get('/facebook', validator.validateNotLoggedIn, controller.getFacebookSignIn);
router.get('/facebook/callback', validator.validateNotLoggedIn, controller.getFacebookSignInCallback);

/* -- Twitter OAuthStrategy --*/
router.get('/twitter', validator.validateNotLoggedIn, controller.getTwitterSignIn);
router.get('/twitter/callback', validator.validateNotLoggedIn, controller.getTwitterSignInCallback);

module.exports = router;
