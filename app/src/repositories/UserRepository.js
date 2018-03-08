const bcrypt = require('bcryptjs');
const User = require('../model/User');
const DocumentSettings = require('../model/DocumentSettings');

/**
 * Gets User by username.
 *
 * @param {String} username
 * @returns {Promise}
 */
const getUserByUsername = (username) => {
    return User.findOne({username: username}).populate('defaultSettings').exec();
};

/**
 * Gets User by id.
 *
 * @param {ObjectId|String} userId
 * @returns {Promise}
 */
const getUserById = (userId) => {
    return User.findOne({_id: userId}).populate('defaultSettings').exec();
};

/**
 * Creates and stores new User.
 *
 * @param {object} user data
 * @returns {Promise}
 */
const createUser = (user) => {
    return bcrypt.hash(user.password, 10)
        .then(function (hash) {
            return new DocumentSettings().save().then((defaultSettings) => {
                return User(Object.assign(user, {password: hash, defaultSettings: defaultSettings})).save();
            });
        });
};

const updateDefaultDocumentSettings = (user, settings) => {
    return DocumentSettings.findOneAndUpdate({_id: user.defaultSettings._id}, settings, { new: true });
};

module.exports = {
    getUserByUsername: getUserByUsername,
    getUserById: getUserById,
    createUser: createUser,
    updateDefaultDocumentSettings: updateDefaultDocumentSettings
};