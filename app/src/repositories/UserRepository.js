const bcrypt = require('bcryptjs');
const User = require('../model/User');
const DocumentSettings = require('../model/DocumentSettings');

/**
 * Gets User by username.
 *
 * @param {String} username
 * @returns {Promise}
 */
const getUserByUsername = function (username) {
    return User.findOne({username: username}).populate('defaultSettings').exec();
};

/**
 * Gets User by id.
 *
 * @param {ObjectId|String} userId
 * @returns {Promise}
 */
const getUserById = function (userId) {
    return User.findOne({_id: userId}).populate('defaultSettings').exec();
};

/**
 * Creates and stores new User.
 *
 * @param {object} user data
 * @returns {Promise}
 */
const createUser = function (user) {
    return bcrypt.hash(user.password, 10)
        .then(function (hash) {
            return new DocumentSettings().save().then((defaultSettings) => {
                return User(Object.assign(user, {password: hash, defaultSettings: defaultSettings})).save();
            });
        });
};

module.exports = {
    getUserByUsername: getUserByUsername,
    getUserById: getUserById,
    createUser: createUser,
};