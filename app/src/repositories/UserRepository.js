const bcrypt = require('bcryptjs');
const User = require('../model/User');
const DocumentSettings = require('../model/DocumentSettings');

const debug = require('debug')('editor:authController');

/**
 * Gets User by field value.
 *
 * @param {String} field - Field name
 * @param {String} value - Expected field value
 * @returns {Promise<User>}
 */
const getUserBy = (field, value) => {
    return User.findOne({[field]: value}).populate('defaultSettings').exec();
};

/**
 * Gets User by username.
 *
 * @param {String} username
 * @returns {Promise<User>}
 */
const getUserByUsername = (username) => {
    return getUserBy('username', username);
};

/**
 * Gets User by id.
 *
 * @param {ObjectId|String} userId
 * @returns {Promise<User>}
 */
const getUserById = (userId) => {
    return getUserBy('_id', userId);
};

/**
 * Creates and stores new User.
 *
 * @param {object} user - data
 * @returns {Promise<User>} created user document
 */
const createUser = (user) => {
    return (user.password) ? bcrypt.hash(user.password, 10) : Promise.resolve()
        .then(function (hash) {
            return new DocumentSettings().save().then((defaultSettings) => {
                return User(Object.assign(user, {password: hash, defaultSettings: defaultSettings})).save();
            });
        });
};

const getUniqueUsername = (proposedUsername, tryCount = 0) => {
    return User
        .findOne({username: proposedUsername})
        .then(function (user) {
            if (user) {
                proposedUsername += (tryCount + 1);
                return getUniqueUsername(proposedUsername, (tryCount + 1)); // <== return statement here
            }
            return proposedUsername;
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
    let promises = [];

    if (data.username) {
        promises.push(validateUniqueUsername(user, data.username).then(() => {
            user.username = data.username;
        }));
    }
    if (data.email) user.email = data.email;

    if (data.newPassword) {
        promises.push(bcrypt.hash(data.newPassword, 10)
            .then(function (hash) {
                user.password = hash;
            }));
    }

    return Promise.all(promises).then(() => {
        return user.save();
    });
};

const validateUniqueUsername = (user, username) => {
    return getUserByUsername(username).then((foundUser) => {
        return (foundUser === null || user._id === foundUser._id) ? Promise.resolve() : Promise.reject({code: 11000});
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
    return DocumentSettings.findOneAndUpdate({_id: user.defaultSettings._id}, settings, {new: true});
};

module.exports = {
    getUserBy: getUserBy,
    getUserByUsername: getUserByUsername,
    getUserById: getUserById,
    createUser: createUser,
    getUniqueUsername: getUniqueUsername,
    updateUser: updateUser,
    updateDefaultDocumentSettings: updateDefaultDocumentSettings
};