const passport = require('passport');

const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
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

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BASE_URL}/api/auth/google/callback`
    },
    function(accessToken, refreshToken, profile, done) {
        AuthRepository.getOrCreateUserByGoogleId(profile.id, profile.displayName, profile.emails[0].value).then((user) => {
            done(null, user);
        }).catch((error) => {
            setTimeout(function () {
                done(error, false);
            }, 3000);
        });
    }
));

passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: `${process.env.BASE_URL}/api/auth/facebook/callback`
    },
    function(accessToken, refreshToken, profile, done) {
        AuthRepository.getOrCreateUserByFacebookId(profile.id, profile.displayName, `${profile.id}@facebook.com`).then((user) => {
            done(null, user);
        }).catch((error) => {
            setTimeout(function () {
                done(error, false);
            }, 3000);
        });
    }
));

passport.use(new TwitterStrategy({
        userProfileURL: 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: `${process.env.BASE_URL}/api/auth/twitter/callback`
    },
    function(token, tokenSecret, profile, done) {
        AuthRepository.getOrCreateUserByTwitterId(profile.id, profile.username, profile.emails[0].value).then((user) => {
            done(null, user);
        }).catch((error) => {
            setTimeout(function () {
                done(error, false);
            }, 3000);
        });
    }
));

