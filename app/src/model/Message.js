const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    message: {type: String, required: true, maxlength: 5000},
    date: {type: Date, required: true, default: () => Date.now()},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    document: {type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true},
});

module.exports = mongoose.model('Message', messageSchema);
