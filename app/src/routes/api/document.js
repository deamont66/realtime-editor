const router = require('express').Router();

const authValidator = require('../../middlewares/AuthMiddleware');
const validator = require('../../middlewares/DocumentMiddleware');
const controller = require('../../controllers/DocumentController');

router.get('/', authValidator.validateLoggedIn(), controller.getDocuments);
router.get('/last', authValidator.validateLoggedIn(), controller.getLastDocuments);
router.get('/shared', authValidator.validateLoggedIn(), controller.getSharedDocuments);

router.post('/', authValidator.validateLoggedIn(), controller.postCreateDocument);

router.get('/:documentId/messages', validator.validateGetMessages(), controller.getMessages);
router.post('/:documentId/messages', [
    authValidator.validateLoggedIn(),
    validator.validateCreateMessage()
], controller.postCreateMessage);

router.get('/:documentId/rights', controller.getRights);
router.put('/:documentId/rights', validator.validateLinkRights(), controller.putLinkRights);

router.put('/:documentId/rights/invite', validator.validateUserRights(), controller.putUserRights);
router.delete('/:documentId/rights/:toUserID', controller.deleteUserRights);

router.delete('/:documentId', controller.deleteDocument);

module.exports = router;

