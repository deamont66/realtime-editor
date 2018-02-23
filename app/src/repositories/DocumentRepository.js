const Document = require('../model/Document');
const DocumentSettings = require('../model/DocumentSettings');


const getDocumentsByOwner = (user) => {
    return Document.find({owner: user}).select('-lastAckContent -settings -shareLinkRights').populate('owner').exec();
};

const getSharedDocumentsByUser = (user) => {

};

const getLastDocumentsByUser = (user) => {

};

const getDocumentById = (documentId) => {
    return Document.findOne({_id: documentId}).populate('settings').exec();
};

const createDocument = (owner) => {
    const settings = owner.defaultSettings.toObject();
    delete settings._id;
    delete settings.__v;
    console.log(settings);

    return new DocumentSettings(settings).save().then((settings) => {
        return new Document({settings: settings, owner: owner}).save();
    });
};

const updateLastContent = (document, value) => {
    document.lastAckContent = value;
    document.lastChange = Date.now();
    return document.save();
};

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


module.exports = {
    getDocumentsByOwner: getDocumentsByOwner,
    getSharedDocumentsByUser: getSharedDocumentsByUser,
    getLastDocumentsByUser: getLastDocumentsByUser,
    getDocumentById: getDocumentById,
    createDocument: createDocument,
    updateLastContent: updateLastContent,
    updateSettings: updateSettings,
};