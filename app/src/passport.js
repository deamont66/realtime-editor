const passport = require('passport');
const LocalStrategy = require('passport-local');

const UserRepository = require('./repositories/UserRepository');
const Errors = require('./utils/Errors');

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    UserRepository.getUserById(id).then(function (user) {
        if (!user) done(Errors.notFound, null);
        done(null, user);
    });
});

passport.use(
    new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, function (username, password, done) {
        UserRepository.getUserByUsername(username).then(function (user) {
            if (!user) {
                return Promise.reject(Errors.userInvalidCredential);
            }
            return user.authenticate(password).then((valid) => {
                if (!valid) return Promise.reject(Errors.userInvalidCredential);
                return user;
            });
        }).then((user) => {
            done(null, user);
        }).catch((error) => {
            setTimeout(function () {
                done(error, null);
            }, 3000);
        });
    })
);
