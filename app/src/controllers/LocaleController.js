const path = require('path');
const Errors = require('../utils/Errors');

module.exports = {
    getTranslation: (req, res, next) => {
        res.sendFile(req.params.lang.slice(0, 2) + '.json', {
            root: path.join(__dirname, '../langs/')
        }, (err) => {
            if (err) {
                next(Errors.notFound);
            }
        });
    }
};
