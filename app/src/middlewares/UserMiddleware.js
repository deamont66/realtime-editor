const Errors = require('../utils/Errors');

const validateSigIn = function (req, res, next) {

    next();
};

const validateSigUp = function (req, res, next) {

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
    validateSigIn: validateSigIn,
    validateSigUp: validateSigUp,
    validateLoggedIn: validateLoggedIn,
    validateNotLoggedIn: validateNotLoggedIn,
};