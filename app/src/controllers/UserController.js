const UserRepository = require('../repositories/UserRepository');
const Errors = require('../utils/Errors');
const passport = require('passport');

module.exports = {
    postSignIn: function (req, res, next) {
        passport.authenticate('local', function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return next(Errors.userInvalidCredential);
            }
            req.login(user, function (err) {
                if (err) {
                    return next(err);
                }

                res.status(200).json({
                    status: 'success',
                    user: user
                });
            });
        })(req, res, next);
    },
    postSignUp: function (req, res, next) {
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
    getUser: function (req, res, next) {
        res.status(200).json({
            status: 'success',
            user: req.user.toJSON()
        });
    },
    putUser: function (req, res, next) {
        req.user.authenticate(req.body.password).then((res) => {
            if(!res) {
                return Promise.reject(Errors.userInvalidCredential);
            }
            return UserRepository.updateUser(req.user, req.body);
        }).then(() => {
            res.sendStatus(204);
        }).catch(function (err) {
            err.json = true;
            if (err.code === 11000)
                next(Errors.usernameAlreadyUsed);
            next(err);
        });
    },
    deleteSignOut: function (req, res, next) {
        req.logout();
        res.sendStatus(204);
    },
    getDefaultDocumentSettings: function (req, res, next) {
        const settings = req.user.defaultSettings.toObject();
        delete settings._id;
        delete settings.__v;

        res.status(200).json({
            status: 'success',
            settings: settings
        });
    },
    putDefaultDocumentSettings: function (req, res, next) {
        UserRepository.updateDefaultDocumentSettings(req.user, req.body.settings).then((settings) => {
            res.status(200).json({
                status: 'success',
                settings: settings.toJSON()
            });
        }).catch(function (err) {
            err.json = true;
            next(err);
        });
    }
};