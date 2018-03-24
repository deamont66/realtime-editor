const path = require('path');
const fs = require('fs');
const translate = require('../langs/en');
const generateMetaTags = require('../utils/generateMetaTags');
const DocumentRepository = require('../repositories/DocumentRepository');
const DocumentVoter = require('../security/DocumentVoter');


const renderWithMeta = (req, res, next) => {
    const regex = /<meta name="replace-start">.*<meta name="replace-end">/g;
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    const metaTags = generateMetaTags(fullUrl, res.locals.title, res.locals.description);

    console.log(res.locals.title);

    fs.readFile(path.join(__dirname, '../../client/build-prod/index.html'), (err, data) => {
        if (err) {
            next(err);
            return;
        }
        res.setHeader('Content-type', 'text/html; charset=utf-8');
        res.send(data.toString().replace(regex, metaTags));
        //res.send(metaTags);
    });
};

const router = require('express').Router();

router.all('/sign-in', (req, res, next) => {
    res.locals.title = translate['app']['titles']['sign_in'];
    renderWithMeta(req, res, next);
});

router.all('/sign-up', (req, res, next) => {
    res.locals.title = translate['app']['titles']['sign_up'];
    renderWithMeta(req, res, next);
});

router.all('/settings', (req, res, next) => {
    res.locals.title = translate['app']['titles']['account_settings'];
    renderWithMeta(req, res, next);
});

router.all('/settings/document', (req, res, next) => {
    res.locals.title = translate['app']['titles']['document_settings'];
    renderWithMeta(req, res, next);
});

router.all('/document', (req, res, next) => {
    res.locals.title = translate['app']['titles']['my_documents'];
    renderWithMeta(req, res, next);
});

router.all('/document/shared', (req, res, next) => {
    res.locals.title = translate['app']['titles']['shared_documents'];
    renderWithMeta(req, res, next);
});

router.all('/document/history', (req, res, next) => {
    res.locals.title = translate['app']['titles']['last_documents'];
    renderWithMeta(req, res, next);
});

router.all('/document/:documentId', (req, res, next) => {
    DocumentRepository.getDocumentById(req.params.documentId).then((document) => {
        return DocumentVoter.can('view', req.user, document).then(() => {
            res.locals.title = document.title;
            renderWithMeta(req, res, next);
        });
    }).catch(() => {
        next();
    });
});

router.all('/', (req, res, next) => {
    renderWithMeta(req, res, next);
});

router.use((req, res, next) => {
    res.locals.title = translate['error']['not_found'];
    renderWithMeta(req, res, next);
});

module.exports = router;
module.exports.renderWithMeta = renderWithMeta;
