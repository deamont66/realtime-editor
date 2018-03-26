const passport = require('passport');

const RememberMeStrategy = require('passport-remember-me').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const CTUOAuth2Strategy = require('./security/CTUOAuth2Strategy');

const UserRepository = require('./repositories/UserRepository');
const AuthRepository = require('./repositories/AuthRepository');

const authenticate = (promise, done) => {
    return promise.then((user) => {
        done(null, user);
    }).catch((error) => {
        setTimeout(function () {
            done(error, false);
        }, 3000);
    });
};

const authenticateUsingProfileField = (req, done, field, value, username, email) => {
    let promise;
    if(!req.user) {
        req.session.redirectTo = '/document';
        promise = AuthRepository.getOrCreateUserByField(field, value, username, email);
    } else {
        req.session.redirectTo = '/settings/connected';
        promise = AuthRepository.connectFieldToUser(field, value, req.user);
    }
    req.session.save();
    return authenticate(promise, done);
};


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

passport.use(new RememberMeStrategy(
    function(token, done) {
        authenticate(AuthRepository.consumeRememberMeToken(token), done);
    },
    function(user, done) {
        AuthRepository.issueRememberMeToken(user).then((token) => {
            done(null, token);
        }).catch(err => {
            done(err, false);
        });
    }
));

passport.use(
    new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, function (username, password, done) {
        authenticate(AuthRepository.getAndAuthenticateUser(username, password), done);
    })
);

passport.use(new CTUOAuth2Strategy({
        passReqToCallback: true,
        authorizationURL: 'https://auth.fit.cvut.cz/oauth/oauth/authorize',
        tokenURL: 'https://auth.fit.cvut.cz/oauth/oauth/token',
        clientID: process.env.CTU_CLIENT_ID,
        clientSecret: process.env.CTU_CLIENT_SECRET,
        callbackURL: `${process.env.BASE_URL}/api/auth/ctu/callback`
    },
    function (req, accessToken, refreshToken, profile, done) {
        authenticateUsingProfileField(req, done, 'CTUUsername', profile.username, profile.username, profile.email);
    }
));

passport.use(new GoogleStrategy({
        passReqToCallback: true,
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BASE_URL}/api/auth/google/callback`
    },
    function (req, accessToken, refreshToken, profile, done) {
        authenticateUsingProfileField(req, done, 'googleId', profile.id, profile.displayName, profile.emails[0].value);
    }
));

passport.use(new FacebookStrategy({
        passReqToCallback: true,
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: `${process.env.BASE_URL}/api/auth/facebook/callback`
    },
    function (req, accessToken, refreshToken, profile, done) {
        authenticateUsingProfileField(req, done, 'facebookId', profile.id, profile.displayName, `${profile.id}@facebook.com`);
    }
));

passport.use(new TwitterStrategy({
        passReqToCallback: true,
        userProfileURL: 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: `${process.env.BASE_URL}/api/auth/twitter/callback`
    },
    function (req, token, tokenSecret, profile, done) {
        authenticateUsingProfileField(req, done, 'twitterId', profile.id, profile.username, profile.emails[0].value);
    }
));

