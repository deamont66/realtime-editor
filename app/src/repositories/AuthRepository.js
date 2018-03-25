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
        if (user) return user;

        return UserRepository.getUniqueUsername(username).then((uniqueUsername) => {
            return UserRepository.createUser({
                username: uniqueUsername, email, CTUUsername: username
            });
        });
    }).then((user) => {
        user.lastLogin = Date.now();
        return user.save();
    });
};

const getOrCreateUserByGoogleId = (googleId, username, email) => {
    return UserRepository.getUserByGoogleId(googleId).then((user) => {
        if (user) return user;

        return UserRepository.getUniqueUsername(username).then((uniqueUsername) => {
            return UserRepository.createUser({
                username: uniqueUsername, email, googleId
            });
        });
    }).then((user) => {
        user.lastLogin = Date.now();
        return user.save();
    });
};

const getOrCreateUserByFacebookId = (facebookId, username, email) => {
    return UserRepository.getUserByFacebookId(facebookId).then((user) => {
        if (user) return user;

        return UserRepository.getUniqueUsername(username).then((uniqueUsername) => {
            return UserRepository.createUser({
                username: uniqueUsername, email, facebookId
            });
        });
    }).then((user) => {
        user.lastLogin = Date.now();
        return user.save();
    });
};

const getOrCreateUserByTwitterId = (twitterId, username, email) => {
    return UserRepository.getUserByTwitterId(twitterId).then((user) => {
        if (user) return user;

        return UserRepository.getUniqueUsername(username).then((uniqueUsername) => {
            return UserRepository.createUser({
                username: uniqueUsername, email, twitterId
            });
        });
    }).then((user) => {
        user.lastLogin = Date.now();
        return user.save();
    });
};

module.exports = {
    getAndAuthenticateUser: getAndAuthenticateUser,
    getOrCreateUserByCTUUsername: getOrCreateUserByCTUUsername,
    getOrCreateUserByGoogleId: getOrCreateUserByGoogleId,
    getOrCreateUserByFacebookId: getOrCreateUserByFacebookId,
    getOrCreateUserByTwitterId: getOrCreateUserByTwitterId
};
