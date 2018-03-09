const DocumentRepository = require('../repositories/DocumentRepository');
const MessageRepository = require('../repositories/MessageRepository');

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
        DocumentRepository.removeDocumentById(req.params.documentId).then(() => {
            res.sendStatus(204);
        }).catch((err) => {
            next(err);
        });
    },

    getMessages: (req, res, next) => {
        DocumentRepository.getDocumentById(req.params.documentId).then((document) => {
            return MessageRepository.getLastMessages(document, req.query.lastDate, req.query.number).then((messages) => {
                return messages;
            });
        }).then((messages) => {
            res.json({
                status: 'success',
                messages: messages
            });
        }).catch((err) => {
            next(err);
        });
    },
    postCreateMessage: (req, res, next) => {
        DocumentRepository.getDocumentById(req.params.documentId).then((document) => {
            return MessageRepository.createMessage(document, req.user, req.body.message).then((document) => {

            });
        }).then(() => {
            res.json({
                status: 'success'
            });
        }).catch((err) => {
            next(err);
        });
    },

    getRights: (req, res, next) => {
        next();
    },
    putLinkRights: (req, res, next) => {
        next();
    },

    putUserRights: (req, res, next) => {
        next();
    },
    deleteUserRights: (req, res, next) => {
        next();
    }
};
