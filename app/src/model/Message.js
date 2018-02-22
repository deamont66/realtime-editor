const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const message = new Schema({
    message: {type: String, required: true},
    from: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    document: {type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true},
});

const Message = mongoose.model('Message', message);
module.exports = Message;
