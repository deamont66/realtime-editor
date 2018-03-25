const UserRepository = require('../repositories/UserRepository');
const Errors = require('../utils/Errors');
const passport = require('passport');

const debug = require('debug')('editor:authController');


const handleAuthentication = (req, res, next, redirect = true) => (err, user) => {
    const onError = (err) => (redirect) ? res.redirect('/sign-in') : next(err);
    const onSuccess = (user) => (redirect) ? res.redirect(req.session.redirectTo) : res.status(200).json({
        status: 'success',
        user: user
    });

    if (err || !user) {
        debug(err);
        return onError(err || Errors.userInvalidCredential);
    }
    req.login(user, function (err) {
        if (err) {
            debug(err);
            return onError(err);
        }
        onSuccess(user);
    });
};


module.exports = {
    deleteSignOut: (req, res, next) => {
        req.logout();
        res.sendStatus(204);
    },

    deleteField: field => (req, res, next) => {
        req.user[field] = undefined;
        req.user.save().then(() => {
            res.sendStatus(204);
        }).catch((err) => {
            next(err);
        })
    },

    postLocalSignUp: (req, res, next) => {
        UserRepository.createUser({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
        }).then(function (user) {
            return new Promise((resolve, reject) => {
                req.login(user, function (err) {
                    if (err) {
                        reject(err);
                    }
                    resolve(user);
                });
            });
        }).then((user) => {
            res.status(200).json({
                status: 'success',
                user: user.toJSON()
            });
        }).catch(function (err) {
            err.json = true;
            if (err.code === 11000)
                next(Errors.usernameAlreadyUsed);
            else
                next(err);
        });
    },

    postLocalSignIn: (req, res, next) => passport.authenticate('local', handleAuthentication(req, res, next, false))(req, res, next),

    getCTUAuthenticate: (req, res, next) => passport.authenticate('ctu')(req, res, next),
    getCTUCallback: (req, res, next) => passport.authenticate('ctu', handleAuthentication(req, res, next))(req, res, next),

    getGoogleAuthenticate: (req, res, next) => passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/plus.login', 'email']})(req, res, next),
    getGoogleCallback: (req, res, next) => passport.authenticate('google', handleAuthentication(req, res, next))(req, res, next),

    getFacebookAuthenticate: (req, res, next) => passport.authenticate('facebook', {scope: ['public_profile']})(req, res, next),
    getFacebookCallback: (req, res, next) => passport.authenticate('facebook', handleAuthentication(req, res, next))(req, res, next),

    getTwitterAuthenticate: (req, res, next) => passport.authenticate('twitter')(req, res, next),
    getTwitterCallback: (req, res, next) => passport.authenticate('twitter', handleAuthentication(req, res, next))(req, res, next)
};