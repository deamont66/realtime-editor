const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const documentInvite = new Schema({
    from: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    to: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    rights: {type: Number, min: 0, max: 4, required: true, default: 0},
    document: {type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true},
});

const DocumentInvite = mongoose.model('DocumentInvite', documentInvite);
module.exports = DocumentInvite;
