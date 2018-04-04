const UserRepository = require('./UserRepository');
const moment = require('moment');

const Errors = require('../utils/Errors');
const mailer = require('../mailer');

const debug = require('debug')('editor:authRepository');

/**
 * Invalidates valid token or fails.
 *
 * @param {String} token - token to be invalidated
 * @return {Promise<User>}
 */
const consumeRememberMeToken = (token) => {
    return UserRepository.getUserBy('rememberMeToken', token).then((user) => {
        if (!user) {
            return Promise.reject(Errors.userInvalidCredential);
        }
        user.rememberMeToken = undefined;
        return user.save();
    })
};

/**
 * Generates new unique token for user.
 *
 * @param {ObjectId|String|User} user
 * @return {Promise<String>} token
 */
const issueRememberMeToken = (user) => {
    return UserRepository.getUniqueToken('rememberMeToken').then((token) => {
        user.rememberMeToken = token;
        return user.save().then(() => token);
    });
};

/**
 * Invalidates valid token or fails.
 *
 * @param {String} token - token to be invalidated
 * @return {Promise<User>}
 */
const consumeForgotPasswordToken = (token) => {
    return UserRepository.getUserBy('recoverToken', token).then((user) => {
        if (!user || moment().isAfter(user.recoverEnd)) {
            return Promise.reject(Errors.userInvalidCredential);
        }
        user.recoverToken = undefined;
        user.recoverEnd = undefined;
        return user.save();
    })
};

/**
 * Generates new unique token for user valid for 2 days from now.
 *
 * @param {ObjectId|String|User} user
 * @return {Promise<String>} token
 */
const issueForgotPasswordToken = (user) => {
    return UserRepository.getUniqueToken('recoverToken').then((token) => {
        user.recoverToken = token;
        user.recoverEnd = moment().add(2, 'days').toDate();
        return user.save().then(() => token);
    });
};

/**
 * Gets user matching username and password or fails.
 *
 * @param {String} username
 * @param {String} password
 * @return {Promise<User>}
 */
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

/**
 * Gets user matching field value or creates new with given field value, username and email.
 *
 * @param {String} field
 * @param {String} value
 * @param {String} username
 * @param {String} email
 *
 * @return {Promise<User>}
 */
const getOrCreateUserByField = (field, value, username, email) => {
    return UserRepository.getUserBy(field, value).then((user) => {
        if (user) return user;

        return UserRepository.getUniqueUsername(username).then((uniqueUsername) => {
            return UserRepository.createUser({
                username: uniqueUsername, email, [field]: value
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

/**
 * Sets field value to given user or fails when another user already uses this value.
 *
 * @param {String} field
 * @param {String} value
 * @param {User} user
 * @return {Promise<User>}
 */
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
    consumeForgotPasswordToken: consumeForgotPasswordToken,
    issueForgotPasswordToken: issueForgotPasswordToken,
    getAndAuthenticateUser: getAndAuthenticateUser,
    getOrCreateUserByField: getOrCreateUserByField,
    connectFieldToUser: connectFieldToUser
};
