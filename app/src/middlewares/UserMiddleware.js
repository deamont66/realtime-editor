const Errors = require('../utils/Errors');
const UserRepository = require('../repositories/UserRepository');

const validateSigIn = function (req, res, next) {

    next();
};

const validateSigUp = function (req, res, next) {

    next();
};

const validateLoggedIn = function (req, res, next) {
    if (!req.session.uid)
        next(Errors.userNotLoggedIn);

    UserRepository.getUserById(req.session.uid).then(function (userData) {
        req.user = userData;
        next();
    }).catch(function () {
        delete req.session.uid;
        next(Errors.userNotLoggedIn);
    });
};

const validateNotLoggedIn = function (req, res, next) {
    if(req.session.uid) {
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