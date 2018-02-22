const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, lowercase: true, required: true },
    password: { type: String, required: true },
    defaultSettings: {type: mongoose.Schema.Types.ObjectId, ref: 'DocumentSettings', required: true},
    recoverHash: String,
    recoverEnd: Date,
    lastLogin: Date
});

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.defaultSettings;
    delete obj.recoverHash;
    delete obj.recoverEnd;
    return obj;
};

userSchema.statics.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

userSchema.methods.authenticate = function (password) {
    return this.validatePassword(password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;