const Errors = require('../utils/Errors');

const validateSignIn = function (req, res, next) {

    next();
};

const validateSignUp = function (req, res, next) {

    next();
};

const validateLoggedIn = function (req, res, next) {
    if (!req.user) {
        next(Errors.userNotLoggedIn);
    }
    next();
};

const validateNotLoggedIn = function (req, res, next) {
    if(req.user) {
        next(Errors.userAlreadyLoggedIn);
    }
    next();
};

module.exports = {
    validateSignIn: validateSignIn,
    validateSignUp: validateSignUp,
    validateLoggedIn: validateLoggedIn,
    validateNotLoggedIn: validateNotLoggedIn,
};