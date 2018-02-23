const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const document = new Schema({
    title: {type: String, required: true, default: 'Unnamed document'},
    settings: {type: mongoose.Schema.Types.ObjectId, ref: 'DocumentSettings', required: true},
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    shareLinkRights: {type: Number, min: 0, max: 4, required: true, default: 0},
    lastAckContent: {type: String, default: ''},
    lastChange: {type: Date, required: true, default: Date.now()}
});

const Document = mongoose.model('Document', document);

module.exports = Document;
