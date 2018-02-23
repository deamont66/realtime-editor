const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const operation = new Schema({
    revision: {type: Number, min: 0, required: true},
    operations: {type: String, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    document: {type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true},
    created: {type: Date, required: true, default: Date.now()},
});

const Operation = mongoose.model('Operation', operation);

module.exports = Operation;
