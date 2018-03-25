const UserRepository = require('../repositories/UserRepository');
const Errors = require('../utils/Errors');
const passport = require('passport');

const debug = require('debug')('editor:authController');


const handleAuthentication = (req, res, next, redirect = true) => (err, user) => {
    const onError = (err) => (redirect) ? res.redirect('/sign-in') : next(err);
    const onSuccess = (user) => (redirect) ? res.redirect('/document') : res.status(200).json({status: 'success', user: user});

    if (err || !user) {
        return onError(err || Errors.userInvalidCredential);
    }
    req.login(user, function (err) {
        if (err) {
            return onError(err);
        }
        onSuccess(user);
    });
};


module.exports = {
    deleteSignOut: function (req, res, next) {
        req.logout();
        res.sendStatus(204);
    },
    postLocalSignIn: function (req, res, next) {
        passport.authenticate('local', handleAuthentication(req, res, next, false))(req, res, next);
    },
    postLocalSignUp: function (req, res, next) {
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

    getCTUSingIn: function (req, res, next) {
        return passport.authenticate('ctu')(req, res, next);
    },
    getCTUSignInCallback: function (req, res, next) {
        return passport.authenticate('ctu', handleAuthentication(req, res, next))(req, res, next);
    },

    getGoogleSignIn: function (req, res, next) {
        return passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'email'] })(req, res, next);
    },
    getGoogleSignInCallback: function (req, res, next) {
        return passport.authenticate('google', handleAuthentication(req, res, next))(req, res, next);
    },

    getFacebookSignIn: function (req, res, next) {
        return passport.authenticate('facebook', { scope: ['public_profile'] })(req, res, next);
    },
    getFacebookSignInCallback: function (req, res, next) {
        return passport.authenticate('facebook', handleAuthentication(req, res, next))(req, res, next);
    },

    getTwitterSignIn: function (req, res, next) {
        return passport.authenticate('twitter')(req, res, next);
    },
    getTwitterSignInCallback: function (req, res, next) {
        return passport.authenticate('twitter', handleAuthentication(req, res, next))(req, res, next);
    }
};