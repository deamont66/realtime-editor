const {check} = require('express-validator/check');

const Modes = require('../../client/src/Utils/EditorModes');
const AbstractMiddleware = require('./AbstractMiddleware');

class DocumentMiddleware extends AbstractMiddleware {

    static validateGetMessages() {
        return [
            check('lastDate').optional().trim().toDate(),
            check('number').optional().isInt({min: 1, max: 50}).toInt(),
            super.validateRequest()
        ];
    }

    static validateCreateMessage() {
        return [
            check('message').trim().not().isEmpty().isLength({min: 1, max: 5000}),
            super.validateRequest()
        ];
    }

    static validateLinkRights() {
        return [
            check('shareLinkRights').not().isEmpty().isInt().toInt({min: 0, max: 4}),
            super.validateRequest()
        ];
    }

    static validateUserRights() {
        return [
            check('rights').not().isEmpty().isInt().toInt({min: 1, max: 4}),
            check('to').not().isEmpty().isLength({min: 1}),
            super.validateRequest()
        ];
    }

    static validateDocumentSettings() {
        return [
            check('settings.theme').trim().not().isEmpty(),
            check('settings.mode').isInt({min: 0, max: Modes.all.length - 1}).toInt(),
            check('settings.tabSize').isInt({min: 2, max: 8}).toInt(),
            check('settings.indentUnit').isInt({min: 2, max: 8}).toInt(),
            check('settings.indentWithTabs').isBoolean().toBoolean(),
            check('settings.fontSize').isInt({min: 6, max: 72}).toInt(),
            check('settings.keyMap').isIn(['default', 'emacs', 'sublime', 'vim']),
            check('settings.styleActiveLine').isIn(['true', 'false', 'nonEmpty']),
            check('settings.lineWrapping').isBoolean().toBoolean(),
            check('settings.lineNumbers').isBoolean().toBoolean(),
            super.validateRequest()
        ];
    }
}

module.exports = DocumentMiddleware;
