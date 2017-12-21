var express = require('express');
var path = require('path');
var logger = require('morgan');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://mongodb/realtime-editor', {
    useMongoClient: true,
    user: 'admin',
    pass: 'password123'
})
    .catch(err => console.error(err));

var app = express();
var api = require('./routes/api');

// set sessions
var store = new MongoDBStore({
    uri: 'mongodb://admin:password123@mongodb/realtime-editor',
    collection: 'sessions'
});
store.on('error', function(error) {
    console.error(error);
});

const sessionSettings = {
    secret: 'sl2kfH3nFgj3gjkghJg43BJvbkhvb',
    store: store,
    resave: true,
    saveUninitialized: true,
    cookie: {}
};
app.enable('trust proxy');

if (app.get('env') === 'production') {
    // sessionSettings.cookie.secure = true; // serve secure cookies
}
app.use(session(sessionSettings));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/api', api);

app.use('/static', express.static(path.join(__dirname, '../client/build-prod/static')));
app.use('/resources', express.static(path.join(__dirname, '../client/build-prod/resources')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(/^\/(?!api).*$/, function (req, res, next) {
    res.sendFile(path.join(__dirname, '../client/build-prod/index.html'));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    if (err.json) {
        const response = {
            message: err.message,
            error: true
        };

        if (req.app.get('env') === 'development') {
            Object.assign(response, {
                stack: err
            });
        }
        res.status(err.status || 500).json(response);
    } else {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    }
});

module.exports = app;
