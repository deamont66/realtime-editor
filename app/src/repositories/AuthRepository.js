const UserRepository = require('./UserRepository');

const Errors = require('../utils/Errors');

const debug = require('debug')('editor:authRepository');

const getAndAuthenticateUser = (username, password) => {
    return UserRepository.getUserByUsername(username).then(function (user) {
        if (!user) {
            return Promise.reject(Errors.userInvalidCredential);
        }
        return user.authenticate(password).then((valid) => {
            if (!valid) return Promise.reject(Errors.userInvalidCredential);
            user.lastLogin = Date.now();
            return user.save();
        });
    });
};

const getOrCreateUserByField = (field, value, username, email) => {
    return UserRepository.getUserBy(field, value).then((user) => {
        if (user) return user;

        return UserRepository.getUniqueUsername(username).then((uniqueUsername) => {
            return UserRepository.createUser({
                username: uniqueUsername, email, ['field']: value
            });
        });
    }).then((user) => {
        user.lastLogin = Date.now();
        return user.save();
    });
};

const connectFieldToUser = (field, value, user) => {
    return UserRepository.getUserBy(field, value).then((matchedUser) => {
        if(matchedUser) return Promise.reject(Errors.fieldAlreadyUsed);

        user[field] = value;
        return user.save();
    });
};

module.exports = {
    getAndAuthenticateUser: getAndAuthenticateUser,
    getOrCreateUserByField: getOrCreateUserByField,
    connectFieldToUser: connectFieldToUser
};
