const Errors = require('../utils/Errors');
const {validationResult} = require('express-validator/check');

class AbstractMiddleware {
    constructor() {
        throw new TypeError("Cannot construct Middleware, it is supposed to be static");
    }

    static validateRequest() {
        return (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(Errors.invalidParameters(errors.mapped()));
            }
            next();
        };
    }
}

module.exports = AbstractMiddleware;
