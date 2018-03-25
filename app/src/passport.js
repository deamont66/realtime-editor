const passport = require('passport');
const LocalStrategy = require('passport-local');
const CTUOAuth2Strategy = require('./security/CTUOAuth2Strategy');

const UserRepository = require('./repositories/UserRepository');
const AuthRepository = require('./repositories/AuthRepository');

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    UserRepository.getUserById(id).then(function (user) {
        if (!user) {
            done(false, null);
        }
        done(null, user);
    });
});

passport.use(
    new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, function (username, password, done) {
        AuthRepository.getAndAuthenticateUser(username, password).then((user) => {
            done(null, user);
        }).catch((error) => {
            setTimeout(function () {
                done(error, false);
            }, 3000);
        });
    })
);

passport.use(new CTUOAuth2Strategy({
        authorizationURL: 'https://auth.fit.cvut.cz/oauth/oauth/authorize',
        tokenURL: 'https://auth.fit.cvut.cz/oauth/oauth/token',
        clientID: process.env.CTU_CLIENT_ID,
        clientSecret: process.env.CTU_CLIENT_SECRET,
        callbackURL: `${process.env.BASE_URL}/api/auth/ctu/callback`
    },
    function (accessToken, refreshToken, profile, done) {
        AuthRepository.getOrCreateUserByCTUUsername(profile.username, profile.email).then((user) => {
            done(null, user);
        }).catch((error) => {
            setTimeout(function () {
                done(error, false);
            }, 3000);
        });
    }
));
