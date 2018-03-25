const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, lowercase: true, required: true },
    password: { type: String, required: false },
    defaultSettings: {type: mongoose.Schema.Types.ObjectId, ref: 'DocumentSettings', required: true},
    recoverHash: String,
    recoverEnd: Date,
    lastLogin: { type: Date, required: true, default: () => Date.now() },

    CTUUsername: { type: String, required: false }
});

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    obj.has_password = this.hasPassword();
    delete obj.password;
    delete obj.defaultSettings;
    delete obj.recoverHash;
    delete obj.recoverEnd;
    return obj;
};

userSchema.methods.validatePassword = function (password) {
    if(!this.password) return Promise.resolve(false);
    return bcrypt.compare(password, this.password);
};

userSchema.methods.authenticate = function (password) {
    return this.validatePassword(password);
};

userSchema.methods.hasPassword = function () {
    return (!!this.password);
};

module.exports = mongoose.model('User', userSchema);
