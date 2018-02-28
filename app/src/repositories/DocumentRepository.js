const Document = require('../model/Document');
const DocumentSettings = require('../model/DocumentSettings');
const UserAccess = require('../model/UserAccess');

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
    return Promise.resolve([]);
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
    console.log(settings);

    return new DocumentSettings(settings).save().then((settings) => {
        return new Document({settings: settings, owner: owner}).save();
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


module.exports = {
    getDocumentsByOwner: getDocumentsByOwner,
    getSharedDocumentsByUser: getSharedDocumentsByUser,
    getLastDocumentsByUser: getLastDocumentsByUser,
    getDocumentById: getDocumentById,
    createDocument: createDocument,
    updateLastContent: updateLastContent,
    updateSettings: updateSettings,
    updateUserAccess: updateUserAccess,
};