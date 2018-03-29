const router = require('express').Router();

const validator = require('../../middlewares/AuthMiddleware');
const controller = require('../../controllers/AuthController');

router.delete('/', validator.validateLoggedIn(), controller.deleteSignOut);

router.post('/', [
    validator.validateNotLoggedIn(),
    validator.validateSignUp()
], controller.postLocalSignUp);

/* -- LocalStrategy -- */
router.post('/signIn', [
    validator.validateNotLoggedIn(),
    validator.validateSignIn()
], controller.postLocalSignIn);

router.get('/forgotPassword/:token', validator.validateNotLoggedIn(), controller.getForgotPassword);
router.put('/forgotPassword/:token', validator.validateNotLoggedIn(), controller.putForgetPassword);
router.post('/forgotPassword', validator.validateNotLoggedIn(), controller.postForgetPassword);

/* -- CTU OAuth2Strategy --*/
router.delete('/ctu', validator.validateLoggedIn(), controller.deleteField('CTUUsername'));
router.get('/ctu', validator.validateNotLoggedIn(), controller.getCTUAuthenticate);
router.get('/ctu/connect', validator.validateLoggedIn(), controller.getCTUAuthenticate);
router.get('/ctu/callback', controller.getCTUCallback);

/* -- Google OAuth2Strategy --*/
router.delete('/google', validator.validateLoggedIn(), controller.deleteField('googleId'));
router.get('/google', validator.validateNotLoggedIn(), controller.getGoogleAuthenticate);
router.get('/google/connect', validator.validateLoggedIn(), controller.getGoogleAuthenticate);
router.get('/google/callback', controller.getGoogleCallback);

/* -- Facebook OAuth2Strategy --*/
router.delete('/facebook', validator.validateLoggedIn(), controller.deleteField('facebookId'));
router.get('/facebook', validator.validateNotLoggedIn(), controller.getFacebookAuthenticate);
router.get('/facebook/connect', validator.validateLoggedIn(), controller.getFacebookAuthenticate);
router.get('/facebook/callback', controller.getFacebookCallback);

/* -- Twitter OAuthStrategy --*/
router.delete('/twitter', validator.validateLoggedIn(), controller.deleteField('twitterId'));
router.get('/twitter', validator.validateNotLoggedIn(), controller.getTwitterAuthenticate);
router.get('/twitter/connect', validator.validateLoggedIn(), controller.getTwitterAuthenticate);
router.get('/twitter/callback', controller.getTwitterCallback);

module.exports = router;
