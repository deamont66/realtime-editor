const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const documentInviteSchema = new Schema({
    from: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    to: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true},
    rights: {type: Number, min: 0, max: 4, required: true, default: 0},
    document: {type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true, index: true},
    date: {type: Date, required: true, default: () => Date.now()}
});

module.exports = mongoose.model('DocumentInvite', documentInviteSchema);
