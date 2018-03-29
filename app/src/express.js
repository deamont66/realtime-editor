const express = require('express');
const path = require('path');
const logger = require('morgan');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const passport = require('passport');

module.exports = function (session) {
    const app = express();

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
    app.use(passport.authenticate('remember-me'));

    app.use(express.static(path.join(__dirname, '../client/build-prod'), {index: false}));
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(require('./routes'));

    // error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        if (err.json) {
            const response = {
                message: err.message,
                error: true
            };
            if(err.code) {
                response.code = err.code;
            }

            if (req.app.get('env') === 'development') {
                response.error = err;
                response.stack = err.stack;
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