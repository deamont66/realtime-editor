const OAuth2Strategy = require('passport-oauth2');


class CTUOAuth2Strategy extends OAuth2Strategy {

    constructor(options, verify) {
        super(options, verify);
        this.name = 'ctu';
    }

    userProfile(accessToken, done) {
        this._oauth2._request("GET", "https://auth.fit.cvut.cz/oauth/userinfo", null, null, accessToken, (err, data) => {
            if (err) { return done(err); }
            done(null, JSON.parse(data));
        });
    };
}

module.exports = CTUOAuth2Strategy;
