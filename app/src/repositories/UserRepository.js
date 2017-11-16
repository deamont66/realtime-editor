const bcrypt = require('bcryptjs');
const User = require('../model/User');

const getUserByUsername = function (username) {
    return User.findOne({username: username});
};

const getUserById = function (userId) {
    return User.findOne({_id: userId});
};

const validatePassword = function (hash, password) {
    return bcrypt.compare(password, hash);
};

const createUser = function (user) {
    return bcrypt.hash(user.password, 10)
        .then(function (hash) {
            return User(Object.assign(user, {password: hash})).save();
        });
};

module.exports = {
    getUserByUsername: getUserByUsername,
    getUserById: getUserById,
    validatePassword: validatePassword,
    createUser: createUser,
};