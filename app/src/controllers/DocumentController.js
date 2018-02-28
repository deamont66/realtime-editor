const DocumentRepository = require('../repositories/DocumentRepository');

module.exports = {
    getDocuments: (req, res, next) => {
        DocumentRepository.getDocumentsByOwner(req.user).then((documents) => {
            res.json(documents);
        }).catch((err) => {
            next(err);
        });
    },
    getLastDocuments: (req, res, next) => {
        DocumentRepository.getLastDocumentsByUser(req.user).then((documents) => {
            res.json(documents);
        }).catch((err) => {
            next(err);
        });
    },
    getSharedDocuments: (req, res, next) => {
        DocumentRepository.getSharedDocumentsByUser(req.user).then((documents) => {
            res.json(documents);
        }).catch((err) => {
            next(err);
        });
    },
    postCreateDocument: (req, res, next) => {
        DocumentRepository.createDocument(req.user).then((document) => {
            res.json({
                status: 'success',
                document: document._id
            });
        }).catch((err) => {
            next(err);
        });
    },
    deleteDocument: (req, res, next) => {
        next()
    },
};
