const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userAccessSchema = new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    document: {type: mongoose.Schema.Types.ObjectId, ref: 'Document'},
    accessTime: {type: Date, required: true, default: () => Date.now()}
});

userAccessSchema.index({ user: 1, document: 1 });

module.exports = mongoose.model('UserAccess', userAccessSchema);
