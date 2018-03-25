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

const getOrCreateUserByCTUUsername = (username, email) => {
    return UserRepository.getUserByCTUUsername(username).then((user) => {
        if(user) return user;

        return UserRepository.createUser({
            username, email, CTUUsername: username
        });
    }).then((user) => {
        user.lastLogin = Date.now();
        return user.save();
    });
};

module.exports = {
    getAndAuthenticateUser: getAndAuthenticateUser,
    getOrCreateUserByCTUUsername: getOrCreateUserByCTUUsername
};
