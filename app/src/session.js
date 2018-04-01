const session = require('express-session');
const debug = require('debug')('editor:session');
const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
    uri: process.env.MONGO_DB_URI,
    collection: process.env.MONGO_SESSION_COLLECTION
});
store.on('error', function(error) {
    debug(error);
});

const sessionSettings = {
    secret: process.env.SESSION_SECRET,
    store: store,
    resave: true,
    saveUninitialized: true,
    cookie: {}
};

if (process.env.APP_ENV === 'production') {
    sessionSettings.cookie.secure = true; // serve secure cookies
}

module.exports = {
    session: session(sessionSettings),
    sessionStore: store
};
