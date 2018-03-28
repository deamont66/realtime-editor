const UserRepository = require('./UserRepository');

const Errors = require('../utils/Errors');
const mailer = require('../mailer');

const debug = require('debug')('editor:authRepository');

const consumeRememberMeToken = (token) => {
    return UserRepository.getUserBy('rememberMeToken', token).then((user) => {
        if (!user) {
            return Promise.reject(Errors.userInvalidCredential);
        }
        user.rememberMeToken = undefined;
        return user.save();
    })
};

const issueRememberMeToken = (user) => {
    return UserRepository.getUniqueToken('rememberMeToken').then((token) => {
        user.rememberMeToken = token;
        return user.save().then(() => token);
    });
};

const getAndAuthenticateUser = (username, password) => {
    return UserRepository.getUserByUsername(username).then((user) => {
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
        }).then((user) => {
            mailer.sendWelcomeEmail(user.email, user.username);
            return user;
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
    consumeRememberMeToken: consumeRememberMeToken,
    issueRememberMeToken: issueRememberMeToken,
    getAndAuthenticateUser: getAndAuthenticateUser,
    getOrCreateUserByField: getOrCreateUserByField,
    connectFieldToUser: connectFieldToUser
};
