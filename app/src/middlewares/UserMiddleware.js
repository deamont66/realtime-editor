const {check} = require('express-validator/check');

const AbstractMiddleware = require('./AbstractMiddleware');

class UserMiddleware extends AbstractMiddleware {

    static validateUser() {
        return [
            check('email').optional().trim().not().isEmpty().withMessage('email.validation.required')
                .isEmail().withMessage('email.validation.valid').normalizeEmail(),
            check('username').optional().trim().not().isEmpty().withMessage('username.validation.required'),
            check('password').optional().trim().not().isEmpty().withMessage('password.validation.required'),
            check('newPassword').optional().trim().not().isEmpty().withMessage('password.validation.required'),
            super.validateRequest()
        ]
    }
}

module.exports = UserMiddleware;
