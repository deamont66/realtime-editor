const UserRepository = require('../repositories/UserRepository');
const Errors = require('../utils/Errors');
const passport = require('passport');

const debug = require('debug')('userController');

module.exports = {
    getUser: function (req, res, next) {
        res.status(200).json({
            status: 'success',
            user: req.user.toJSON()
        });
    },
    putUser: function (req, res, next) {
        req.user.authenticate(req.body.password).then((res) => {
            if(!res && req.user.hasPassword()) {
                return Promise.reject(Errors.userInvalidCredential);
            }
            return UserRepository.updateUser(req.user, req.body);
        }).then(() => {
            res.sendStatus(204);
        }).catch(function (err) {
            err.json = true;
            if (err.code === 11000)
                next(Errors.usernameAlreadyUsed);
            next(err);
        });
    },
    getDefaultDocumentSettings: function (req, res, next) {
        const settings = req.user.defaultSettings.toObject();
        delete settings._id;
        delete settings.__v;

        res.status(200).json({
            status: 'success',
            settings: settings
        });
    },
    putDefaultDocumentSettings: function (req, res, next) {
        UserRepository.updateDefaultDocumentSettings(req.user, req.body.settings).then((settings) => {
            res.status(200).json({
                status: 'success',
                settings: settings.toJSON()
            });
        }).catch(function (err) {
            err.json = true;
            next(err);
        });
    }
};