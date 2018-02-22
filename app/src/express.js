const express = require('express');
const path = require('path');
const logger = require('morgan');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const passport = require('passport');

module.exports = function (session) {
    const app = express();
    const api = require('./routes/api');

    app.use(session);

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'hbs');

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());

    app.use(passport.initialize());
    app.use(passport.session());

    app.use((req, res, next) => {
        console.log(req.headers.cookie);
        next();
    });

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

    return app;
};