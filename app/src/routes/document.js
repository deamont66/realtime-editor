const router = require('express').Router();

//const validator = require('../middlewares/DocumentMiddleware');
const userValidator = require('../middlewares/UserMiddleware');
const controller = require('../controllers/DocumentController');

router.get('/', userValidator.validateLoggedIn, controller.getDocuments);
router.get('/last', userValidator.validateLoggedIn, controller.getLastDocuments);
router.get('/shared', userValidator.validateLoggedIn, controller.getSharedDocuments);

router.post('/', userValidator.validateLoggedIn, controller.postCreateDocument);

router.get('/:documentId/messages', controller.getMessages);
router.post('/:documentId/messages', controller.postCreateMessage);

router.get('/:documentId/rights', controller.getRights);
router.put('/:documentId/rights', controller.putLinkRights);

router.put('/:documentId/rights/invite', controller.putUserRights);
router.delete('/:documentId/rights/:toUserID', controller.deleteUserRights);

router.delete('/:documentId', controller.deleteDocument);

module.exports = router;

