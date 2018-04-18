const {check} = require('express-validator/check');

const AbstractMiddleware = require('./AbstractMiddleware');
const Errors = require('../utils/Errors');

class AuthMiddleware extends AbstractMiddleware {

    static validateSignIn() {
        return [
            check('username').trim().not().isEmpty().withMessage('username.validation.required'),
            check('password').trim().not().isEmpty().withMessage('password.validation.required'),
            check('rememberMe').toBoolean(),
            super.validateRequest()
        ]
    }

    static validateSignUp() {
        return [
            check('email').trim().not().isEmpty().withMessage('email.validation.required')
                .isEmail().withMessage('email.validation.valid').normalizeEmail(),
            check('username').trim().not().isEmpty().withMessage('username.validation.required'),
            check('password').trim().not().isEmpty().withMessage('password.validation.required'),
            super.validateRequest()
        ]
    }

    static validateForgotPasswordRequest() {
        return [
            check('email').trim().not().isEmpty().withMessage('email.validation.required')
                .isEmail().withMessage('email.validation.valid').normalizeEmail(),
            check('username').trim().not().isEmpty().withMessage('username.validation.required'),
            super.validateRequest()
        ]
    }

    static validateForgotPasswordReset() {
        return [
            check('token').trim().not().isEmpty(),
            check('newPassword').trim().not().isEmpty().withMessage('password.validation.required'),
            super.validateRequest()
        ]
    }

    static validateLoggedIn() {
        return (req, res, next) => {
            if (!req.user) {
                next(Errors.userNotLoggedIn);
            }
            next();
        };
    };

    static validateNotLoggedIn() {
        return (req, res, next) => {
            if (req.user) {
                next(Errors.userAlreadyLoggedIn);
            }
            next();
        };
    };
}

module.exports = AuthMiddleware;
