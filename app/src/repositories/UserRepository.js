const bcrypt = require('bcryptjs');
const User = require('../model/User');
const DocumentSettings = require('../model/DocumentSettings');

const getUserByUsername = function (username) {
    return User.findOne({username: username}).populate('defaultSettings').exec();
};

const getUserById = function (userId) {
    return User.findOne({_id: userId}).populate('defaultSettings').exec();
};

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