const UserRepository = require('../repositories/UserRepository');
const Errors = require('../utils/Errors');

module.exports = {
    postSignIn: function (req, res, next) {
        let user = null;
        UserRepository.getUserByUsername(req.body.username).then(function (userData) {
            if (!userData) return Promise.reject(Errors.userInvalidCredential);
            user = userData;
            return UserRepository.validatePassword(user.password, req.body.password);
        }).then(function (valid) {
            if (!valid) return Promise.reject(Errors.userInvalidCredential);
            delete user.password;
            req.session.uid = user._id;

            res.status(200).json({
                status: 'success',
                user: user
            });
        }).catch(function (err) {
            err.json = true;
            next(err);
        });
    },
    postSignUp: function (req, res, next) {
        UserRepository.createUser({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password,
        }).then(function (user) {
            delete user.password;
            req.session.uid = user._id;
            res.status(200).json({
                status: 'success',
                user: user
            });
        }).catch(function (err) {
            err.json = true;
            if(err.code === 11000)
                next(Errors.usernameAlreadyUsed);
            else
                next(err);
        });
    },
    getUser: function (req, res, next) {
        res.status(200).json({
            status: 'success',
            user: req.user
        });
    },
    deleteSignOut: function (req, res, next) {
        delete req.session.uid;
        res.sendStatus(204);
    }
};