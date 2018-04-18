const {matchedData} = require('express-validator/filter');

const DocumentRepository = require('../repositories/DocumentRepository');
const UserRepository = require('../repositories/UserRepository');
const MessageRepository = require('../repositories/MessageRepository');
const DocumentVoter = require("../security/DocumentVoter");
const Errors = require('../utils/Errors');

module.exports = {
    getDocuments: (req, res, next) => {
        DocumentRepository.getDocumentsByOwner(req.user)
            .then((documents) => DocumentRepository.getDocumentsDetails(req.user, documents))
            .then((documents) => {
                res.json(documents);
            }).catch((err) => {
            next(err);
        });
    },
    getLastDocuments: (req, res, next) => {
        DocumentRepository.getLastDocumentsByUser(req.user)
            .then((documents) => DocumentVoter.filter('view', req.user, documents))
            .then((documents) => DocumentRepository.getDocumentsDetails(req.user, documents))
            .then((documents) => {
                res.json(documents);
            }).catch((err) => {
            next(err);
        });
    },
    getSharedDocuments: (req, res, next) => {
        DocumentRepository.getSharedDocumentsByUser(req.user)
            .then((documents) => DocumentRepository.getDocumentsDetails(req.user, documents))
            .then((documents) => {
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
        DocumentRepository.getDocumentById(req.params.documentId).then((document) => {
            return DocumentVoter.can('remove', req.user, document).then(() => {
                return DocumentRepository.removeDocument(document);
            });
        }).then(() => {
            res.sendStatus(204);
        }).catch((err) => {
            next(err);
        });
    },

    getMessages: (req, res, next) => {
        const data = matchedData(req);
        DocumentRepository.getDocumentById(req.params.documentId).then((document) => {
            return DocumentVoter.can('chat', req.user, document).then(() => {
                return MessageRepository.getLastMessages(document, data.lastDate, data.number).then((messages) => {
                    return messages;
                });
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
        const data = matchedData(req);
        DocumentRepository.getDocumentById(req.params.documentId).then((document) => {
            return DocumentVoter.can('chat', req.user, document).then(() => {
                return MessageRepository.createMessage(document, req.user, data.message);
            });
        }).then(() => {
            res.sendStatus(204);
        }).catch((err) => {
            next(err);
        });
    },

    getRights: (req, res, next) => {
        DocumentRepository.getDocumentById(req.params.documentId).then((document) => {
            if (!document) return Promise.reject(Errors.notFound);
            return DocumentVoter.can('share', req.user, document).then(() => {
                return Promise.all([
                    document.shareLinkRights,
                    DocumentRepository.getDocumentInvites(document)
                ]);
            });
        }).then(([shareLinkRights, documentInvites]) => {
            res.json({
                status: 'success',
                shareLinkRights: shareLinkRights,
                documentInvites: documentInvites
            });
        }).catch((err) => {
            next(err);
        });
    },
    putLinkRights: (req, res, next) => {
        const data = matchedData(req);
        DocumentRepository.getDocumentById(req.params.documentId).then((document) => {
            if (!document) return Promise.reject(Errors.notFound);
            return DocumentVoter.can('share', req.user, document).then(() => {
                return DocumentRepository.updateDocumentShareLinkRights(document, data.shareLinkRights);
            });
        }).then(() => {
            res.sendStatus(204);
        }).catch((err) => {
            next(err);
        });
    },

    putUserRights: (req, res, next) => {
        const data = matchedData(req);
        Promise.all([
            DocumentRepository.getDocumentById(req.params.documentId),
            UserRepository.getUserByUsername(data.to)
        ]).then(([document, toUser]) => {
            if (!document || !toUser) return Promise.reject(Errors.notFound);
            return DocumentVoter.can('share', req.user, document).then(() => {
                return DocumentRepository.updateDocumentInvite(document, req.user, toUser, data.rights);
            });
        }).then(() => {
            res.sendStatus(204);
        }).catch((err) => {
            next(err);
        });
    },
    deleteUserRights: (req, res, next) => {
        DocumentRepository.getDocumentById(req.params.documentId).then((document) => {
            if (!document) return Promise.reject(Errors.notFound);
            return DocumentVoter.can('share', req.user, document).then(() => {
                return DocumentRepository.removeDocumentInvite(document, req.params.toUserID);
            });
        }).then(() => {
            res.sendStatus(204);
        }).catch((err) => {
            next(err);
        });
    }
};
