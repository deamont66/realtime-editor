const path = require('path');
const nodeMailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const debug = require('debug')('editor:mailer');

const transporter = nodeMailer.createTransport(
    {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    },
    {
        from: '"Realtime editor" <no-reply@editor.simecekjiri.cz>'
    }
);

transporter.use('compile', hbs({
    viewPath: path.join(__dirname, 'views/emails'),
    extName: '.hbs'
}));

const _sendMail = function (options) {
    transporter.sendMail(options, (error) => {
        if (error) {
            return debug(error);
        }
    });
};

module.exports = {
    sendWelcomeEmail: function (email, username) {
        const mailOptions = {
            to: email,
            subject: 'Welcome to Realtime editor',
            template: 'welcome',
            context: {
                email: email,
                username: username,
                link: path.join(process.env.BASE_URL, '/document')
            }
        };
        _sendMail(mailOptions);
    },
    sendForgotPasswordEmail: function (email, username, hash) {
        const mailOptions = {
            to: email,
            subject: 'Realtime editor Password Change Request',
            template: 'forgotPassword',
            context: {
                email: email,
                username: username,
                link: path.join(process.env.EMAIL_BASEURL, '/forgot-password?hash=' + hash)
            }
        };
        _sendMail(mailOptions);
    },
};
