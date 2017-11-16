module.exports = {
    userAlreadyLoggedIn: {
        json: true,
        message: 'User is already logged in',
        status: 422
    },
    userNotLoggedIn: {
        json: true,
        message: 'User not logged in',
        status: 200
    },
    userInvalidCredential: {
        json: true,
        message: 'User invalid credential',
        status: 422
    },
    usernameAlreadyUsed: {
        json: true,
        message: 'Username is already associated with another account',
        status: 422
    },
    serverError: {
        json: true,
        message: 'Server error',
        status: 500
    },
    invalidParameters: function (message, field = null) {
        const error = {
            json: true,
            message: message || 'Invalid parameters',
            status: 422
        };
        if(field !== null) {
            error.field = field;
        }
        return error;
    },
    notFound: {
        json: true,
        message: 'Not found',
        status: 404
    }
};
