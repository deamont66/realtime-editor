const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');
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
        from: '"Realtime Editor" <no-reply@editor.simecekjiri.cz>'
    }
);

transporter.use('compile', hbs({
    viewPath: path.join(__dirname, 'views/emails'),
    extName: '.inline.hbs'
}));

const _sendMail = function (options) {
    const txtSource = fs.readFileSync(path.join(__dirname, 'views/emails', options.template + '.text.hbs')).toString();
    const template = handlebars.compile(txtSource);
    options.text = template(options.context);
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
            subject: `Welcome to Realtime Editor, ${username}!`,
            template: 'welcome',
            context: {
                email: email,
                username: username,
                homepage_url: process.env.BASE_URL,
                action_url: path.join(process.env.BASE_URL, 'document'),
                login_url: path.join(process.env.BASE_URL, 'sign-in'),
            }
        };
        _sendMail(mailOptions);
    },
    sendForgotPasswordEmail: function (email, username, token, browserIndo) {
        const mailOptions = {
            to: email,
            subject: 'Set up a new password for Realtime Editor',
            template: 'forgotPassword',
            context: {
                username: username,
                homepage_url: process.env.BASE_URL,
                action_url: path.join(process.env.BASE_URL, 'forgot-password', encodeURIComponent(token)),
                operating_system: `${browserIndo.browser.name} ${browserIndo.browser.version}`,
                browser_name: `${browserIndo.os.name} ${browserIndo.os.version}`
            }
        };
        _sendMail(mailOptions);
    },
};
