const {matchedData} = require('express-validator/filter');

const UserRepository = require('../repositories/UserRepository');
const Errors = require('../utils/Errors');

const debug = require('debug')('userController');

module.exports = {
    getUser: function (req, res) {
        res.status(200).json({
            status: 'success',
            user: req.user.toJSON()
        });
    },
    putUser: function (req, res, next) {
        const data = matchedData(req);
        req.user.validatePassword(data.password).then((res) => {
            if(!res && req.user.hasPassword()) {
                return Promise.reject(Errors.userInvalidCredential);
            }
            return UserRepository.updateUser(req.user, data);
        }).then(() => {
            res.sendStatus(204);
        }).catch(function (err) {
            err.json = true;
            if (err.code === 11000) {
                err = Errors.usernameAlreadyUsed;
            }
            next(err);
        });
    },
    getDefaultDocumentSettings: function (req, res) {
        const settings = req.user.defaultSettings.toObject();
        delete settings._id;
        delete settings.__v;

        res.status(200).json({
            status: 'success',
            settings: settings
        });
    },
    putDefaultDocumentSettings: function (req, res, next) {
        const data = matchedData(req);
        UserRepository.updateDefaultDocumentSettings(req.user, data.settings).then((settings) => {
            res.status(200).json({
                status: 'success',
                settings: settings
            });
        }).catch(function (err) {
            err.json = true;
            next(err);
        });
    }
};