const router = require('express').Router();

//const validator = require('../middlewares/DocumentMiddleware');
const userValidator = require('../middlewares/UserMiddleware');
const controller = require('../controllers/DocumentController');

router.get('/', userValidator.validateLoggedIn, controller.getDocuments);
router.get('/last', userValidator.validateLoggedIn, controller.getLastDocuments);
router.get('/shared', userValidator.validateLoggedIn, controller.getSharedDocuments);

router.post('/', userValidator.validateLoggedIn, controller.postCreateDocument);
router.delete('/:documentId', userValidator.validateLoggedIn, controller.deleteDocument);

module.exports = router;
