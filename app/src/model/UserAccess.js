const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userAccessSchema = new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    document: {type: mongoose.Schema.Types.ObjectId, ref: 'Document'},
    accessTime: Date
}, {
    // capped: 16384
});

const UserAccess = mongoose.model('UserAccess', userAccessSchema);

module.exports = UserAccess;
