const bcrypt = require('bcryptjs');
const User = require('../model/User');
const DocumentSettings = require('../model/DocumentSettings');

/**
 * Gets User by username.
 *
 * @param {String} username
 * @returns {Promise<User>}
 */
const getUserByUsername = (username) => {
    return User.findOne({username: username}).populate('defaultSettings').exec();
};

/**
 * Gets User by id.
 *
 * @param {ObjectId|String} userId
 * @returns {Promise<User>}
 */
const getUserById = (userId) => {
    return User.findOne({_id: userId}).populate('defaultSettings').exec();
};

/**
 * Creates and stores new User.
 *
 * @param {object} user - data
 * @returns {Promise<User>} created user document
 */
const createUser = (user) => {
    return bcrypt.hash(user.password, 10)
        .then(function (hash) {
            return new DocumentSettings().save().then((defaultSettings) => {
                return User(Object.assign(user, {password: hash, defaultSettings: defaultSettings})).save();
            });
        });
};

/**
 * Updates user information.
 *
 * @param {User} user - User instance document to be updated
 * @param {Object} data - New user data
 * @param {String} [data.username] - New username
 * @param {String} [data.email] - New email
 * @param {String} [data.newPassword] - New password
 *
 * @returns {Promise<User>} Promise resolved with new updated user document
 */
const updateUser = (user, data) => {
    if(data.username) user.username = data.username;
    if(data.email) user.email = data.email;

    let promise = Promise.resolve();
    if(data.newPassword) {
        promise = bcrypt.hash(data.newPassword, 10)
            .then(function (hash) {
                user.password = hash;
            });
    }
    return promise.then(() => {
        return user.save();
    });
};

/**
 * Updates default document settings for user.
 *
 * @param {User} user - User document whose default settings to be updated.
 * @param {Object} settings - Settings to be updated.
 * @return {Promise<DocumentSettings>}
 */
const updateDefaultDocumentSettings = (user, settings) => {
    return DocumentSettings.findOneAndUpdate({_id: user.defaultSettings._id}, settings, { new: true });
};

module.exports = {
    getUserByUsername: getUserByUsername,
    getUserById: getUserById,
    createUser: createUser,
    updateUser: updateUser,
    updateDefaultDocumentSettings: updateDefaultDocumentSettings
};