const Document = require('../model/Document');
const DocumentSettings = require('../model/DocumentSettings');
const DocumentInvite = require('../model/DocumentInvite');
const UserAccess = require('../model/UserAccess');
const Operation = require('../model/Operation');
const Message = require('../model/Message');

/**
 * Gets documents by User owner.
 * @param {User} user
 * @returns {Promise}
 */
const getDocumentsByOwner = (user) => {
    return Document.find({owner: user})
        .sort('-lastChange')
        .select('-lastAckContent -settings -shareLinkRights')
        .populate('owner')
        .exec();
};

/**
 * Gets shared documents by User.
 *
 * @param {User} user
 */
const getSharedDocumentsByUser = (user) => {
    return DocumentInvite.find({to:user})
        .sort('-date')
        .select('document date from')
        .populate('document from')
        .exec()
        .then((documentInvites) => {
            return documentInvites.map((documentInvite) => {
                const document = documentInvite.document.toJSON();
                document.from = documentInvite.from;
                document.lastAccessed = documentInvite.date;
                return document;
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
    return UserAccess.find({user:user})
        .sort('-accessTime')
        .select('document accessTime')
        .populate('document')
        .exec()
        .then((userAccessArray) => {
            return userAccessArray.map((userAccess) => {
                const document = userAccess.document.toJSON();
                document.lastAccessed = userAccess.accessTime;
                return document;
            })
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

const removeDocumentById = (documentId) => {
    return getDocumentById(documentId).then((document) => {
        return Promise.all([
            UserAccess.find({document: document}).remove().exec(),
            DocumentInvite.find({document: document}).remove().exec(),
            Message.find({document: document}).remove().exec(),
            Operation.find({document: document}).remove().exec(),
            DocumentSettings.findOne({_id: document.settings}).remove().exec(),
            document.remove(),
        ]);
    });
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
    return DocumentInvite.findOneAndUpdate({
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
    createDocument: createDocument,
    removeDocumentById: removeDocumentById,
    updateLastContent: updateLastContent,
    updateSettings: updateSettings,
    updateUserAccess: updateUserAccess,
    getDocumentInvites: getDocumentInvites,
    getHighestDocumentInviteByUser: getHighestDocumentInviteByUser,
    updateDocumentShareLinkRights: updateDocumentShareLinkRights,
    updateDocumentInvite: updateDocumentInvite,
    removeDocumentInvite: removeDocumentInvite
};