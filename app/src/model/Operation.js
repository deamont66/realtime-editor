const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const operation = new Schema({
    number: {type: Number, min: 0, required: true},
    operationJson: {type: String, required: true},
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    document: {type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true}
});

const Operation = mongoose.model('Operation', operation);

module.exports = Operation;
