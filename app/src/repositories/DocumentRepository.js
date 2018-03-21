const Document = require('../model/Document');
const DocumentSettings = require('../model/DocumentSettings');
const DocumentInvite = require('../model/DocumentInvite');
const UserAccess = require('../model/UserAccess');
const Operation = require('../model/Operation');
const Message = require('../model/Message');
const User = require('../model/User');

const Errors = require('../utils/Errors');


const getDocumentsDetails = (user, documents) => {
    return Promise.all(documents.map(document => {
        return getDocumentDetails(user, document);
    }));
};

const getDocumentDetails = (user, document) => {
    return Promise.all([
        User.findById(document.owner).select('username').exec(),
        UserAccess.findOne({user, document}).select('accessTime').exec(),
        DocumentInvite.findOne({to: user, document}).select('from').populate('from').exec()
    ]).then(([owner, accessed, invite]) => {
        const data = document.toJSON();
        data.owner = owner.username;
        if (invite) data.from = invite.from.username;
        if (accessed) data.lastAccessed = accessed.accessTime;
        return data;
    });
};

/**
 * Gets documents by User owner.
 * @param {User} user
 * @returns {Promise}
 */
const getDocumentsByOwner = (user) => {
    return Document.find({owner: user})
        .exec();
};

/**
 * Gets shared documents by User.
 *
 * @param {User} user
 */
const getSharedDocumentsByUser = (user) => {
    return DocumentInvite.find({to: user})
        .select('document')
        .populate('document')
        .exec()
        .then((documentInvites) => {
            return documentInvites.map((documentInvite) => {
                return documentInvite.document;
            })
        });
};

/**
 * Gets last documents by User.
 *
 * @param {User} user
 * @returns {Promise}
 */
const getLastDocumentsByUser = (user) => {
    return UserAccess.find({user: user})
        .select('document')
        .populate('document')
        .exec()
        .then((userAccessArray) => {
            return userAccessArray.map((userAccess) => {
                return userAccess.document;
            });
        });
};

/**
 * Gets document be ID.
 *
 * @param {ObjectId|String} documentId
 * @returns {Promise}
 */
const getDocumentById = (documentId) => {
    return Document.findOne({_id: documentId})
        .populate('settings')
        .exec();
};

/**
 * Creates and stores new document for User.
 *
 * @param {User} owner
 */
const createDocument = (owner) => {
    const settings = owner.defaultSettings.toObject();
    delete settings._id;
    delete settings.__v;

    return new DocumentSettings(settings).save().then((settings) => {
        return new Document({settings: settings, owner: owner}).save();
    });
};

const removeDocument = (document) => {
    return Promise.all([
        UserAccess.find({document: document}).remove().exec(),
        DocumentInvite.find({document: document}).remove().exec(),
        Message.find({document: document}).remove().exec(),
        Operation.find({document: document}).remove().exec(),
        DocumentSettings.findOne({_id: document.settings}).remove().exec(),
        document.remove(),
    ]);
};

/**
 * Updates lastAckContent and lastChange of Document.
 *
 * @param {Document} document
 * @param {String} value
 */
const updateLastContent = (document, value) => {
    document.lastAckContent = value;
    document.lastChange = Date.now();
    return document.save();
};

/**
 * Updates DocumentSettings for document.
 *
 * @param {Document} document
 * @param {DocumentSettings} settings
 */
const updateSettings = (document, settings) => {
    document.title = settings.title;
    document.lastChange = Date.now();
    delete settings.title;
    return Promise.all([
        document.save(),
        DocumentSettings.findOneAndUpdate({_id: document.settings._id}, settings)
    ]).then(() => {
        return getDocumentById(document._id);
    });
};

/**
 *
 *
 * @param document
 * @param user
 */
const updateUserAccess = (document, user) => {
    return UserAccess.findOneAndUpdate({
        document: document,
        user: user
    }, {
        accessTime: Date.now()
    }, {
        upsert: true
    }).exec();
};

const getDocumentInvites = (document) => {
    return DocumentInvite.find({document: document, rights: {$gt: 0}})
        .select('to rights')
        .populate('to')
        .exec();
};

const getHighestDocumentInviteByUser = (document, user) => {
    return DocumentInvite.findOne({document: document, to: user, rights: {$gt: 0}})
        .select('rights')
        .sort('-rights')
        .exec();
};

const updateDocumentShareLinkRights = (document, shareLinkRights) => {
    document.shareLinkRights = shareLinkRights;
    return document.save();
};

const updateDocumentInvite = (document, from, to, rights) => {
    console.log(document.owner, to._id);
    return (document.owner.equals(to._id))
        ? Promise.reject(Errors.cannotInviteDocumentOwner)
        : DocumentInvite.findOneAndUpdate({
            document: document,
            to: to
        }, {
            from: from,
            rights: rights,
            date: new Date()
        }, {
            upsert: true
        }).exec();
};

const removeDocumentInvite = (document, to) => {
    return DocumentInvite.findOneAndRemove({
        document: document,
        to: to
    }).exec();
};

module.exports = {
    getDocumentsByOwner: getDocumentsByOwner,
    getSharedDocumentsByUser: getSharedDocumentsByUser,
    getLastDocumentsByUser: getLastDocumentsByUser,
    getDocumentById: getDocumentById,
    getDocumentsDetails: getDocumentsDetails,
    createDocument: createDocument,
    removeDocument: removeDocument,
    updateLastContent: updateLastContent,
    updateSettings: updateSettings,
    updateUserAccess: updateUserAccess,
    getDocumentInvites: getDocumentInvites,
    getHighestDocumentInviteByUser: getHighestDocumentInviteByUser,
    updateDocumentShareLinkRights: updateDocumentShareLinkRights,
    updateDocumentInvite: updateDocumentInvite,
    removeDocumentInvite: removeDocumentInvite
};