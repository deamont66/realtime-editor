const router = require('express').Router();

router.get('/:lang/translation.json', require('../controllers/LocaleController').getTranslation);

module.exports = router;
