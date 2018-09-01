const DocumentRightsEnum = require('../../client/src/Utils/DocumentRightsEnum');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const documentSchema = new Schema({
    title: {type: String, required: false, default: ''},
    settings: {type: mongoose.Schema.Types.ObjectId, ref: 'DocumentSettings', required: true},
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true},
    shareLinkRights: {type: Number, min: 0, max: DocumentRightsEnum.length - 1, required: true, default: 0},
    cacheContent: {type: String, default: ''},
    cacheRevision: {type: Number, default: 0},
    lastChange: {type: Date, required: true, default: () => Date.now()},
    createdDate: {type: Date, required: true, default: () => Date.now()}
});

module.exports = mongoose.model('Document', documentSchema);
