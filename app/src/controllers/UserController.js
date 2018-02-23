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
    deleteSignOut: function (req, res, next) {
        req.logout();
        res.sendStatus(204);
    }
};