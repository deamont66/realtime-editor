const passport = require('passport');
const moment = require('moment');
const parser = require('ua-parser-js');
const {matchedData} = require('express-validator/filter');

const UserRepository = require('../repositories/UserRepository');
const AuthRepository = require('../repositories/AuthRepository');
const Errors = require('../utils/Errors');
const mailer = require('../mailer');

const debug = require('debug')('editor:authController');


const handleRememberMeSuccess = (req, res, user, onSuccess, onError) => {
    ((req.body.rememberMe) ?
        AuthRepository.issueRememberMeToken(user)
            .then(token => res.cookie('remember_me', token, {
                path: '/',
                httpOnly: true,
                maxAge: 604800000
            })) : Promise.resolve())
        .then(() => {
            return onSuccess(user);
        })
        .catch((err) => {
            return onError(err);
        });
};

const handleAuthentication = (req, res, next, redirect = true) => (err, user) => {
    const onError = (err) => (redirect) ? res.redirect(`/${(req.user) ? 'settings/connected' : 'sign-in'}?error=${err.message}`) : next(err);
    const onSuccess = (user) => (redirect) ? res.redirect(req.session.redirectTo) : res.status(200).json({
        status: 'success',
        user: user
    });

    if (err || !user) {
        return onError(err || Errors.userInvalidCredential);
    }
    req.login(user, (err) => {
        if (err) {
            debug(err);
            return onError(err);
        }
        handleRememberMeSuccess(req, res, user, onSuccess, onError);
    });
};


module.exports = {
    deleteSignOut: (req, res) => {
        req.logout();
        res.clearCookie('remember_me');
        res.sendStatus(204);
    },

    deleteField: field => (req, res, next) => {
        req.user[field] = undefined;
        req.user.save().then(() => {
            res.sendStatus(204);
        }).catch((err) => {
            next(err);
        });
    },

    postLocalSignUp: (req, res, next) => {
        const userData = matchedData(req);
        UserRepository.createUser(userData).then((user) => {
            return new Promise((resolve, reject) => {
                req.login(user, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(user);
                });
            });
        }).then((user) => {
            mailer.sendWelcomeEmail(user.email, user.username);
            res.status(200).json({
                status: 'success',
                user: user
            });
        }).catch((err) => {
            err.json = true;
            if (err.code === 11000) {
                err = Errors.usernameAlreadyUsed;
            }
            next(err);
        });
    },

    getForgotPassword: (req, res, next) => {
        UserRepository.getUserBy('recoverToken', req.params.token).then((user) => {
            if(!user || moment().isAfter(user.recoverEnd)) return Promise.reject(Errors.notFound);
        }).then(() => {
            res.sendStatus(204);
        }).catch((err) => {
            next(err);
        });
    },
    postForgetPassword: (req, res, next) => {
        UserRepository.getUserByUsername(req.body.username).then(user => {
            if (user.email !== req.body.email) return Promise.reject();
            return AuthRepository.issueForgotPasswordToken(user).then(token => {
                const uaData = parser(req.headers['user-agent']);
                mailer.sendForgotPasswordEmail(user.email, user.username, token, uaData);
                return Promise.reject();
            });
        }).catch((err) => {
            if(err) debug(err);
            res.status(200).json(Errors.forgetPasswordResponse);
        })
    },
    putForgetPassword: (req, res, next) => {
        AuthRepository.consumeForgotPasswordToken(req.params.token).then(user => {
            return UserRepository.updateUser(user, {newPassword: req.body.newPassword});
        }).then(() => {
            res.sendStatus(204);
        }).catch((err) => {
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