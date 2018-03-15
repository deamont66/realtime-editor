module.exports = {
    notFound: {
        json: true,
        message: 'Not found',
        code: 4000,
        status: 404
    },
    userAlreadyLoggedIn: {
        json: true,
        message: 'User is already logged in',
        code: 4001,
        status: 422
    },
    userNotLoggedIn: {
        json: true,
        message: 'User not logged in',
        code: 4002,
        status: 200 // should be 422, but React user pooling spams Chrome console with errors
    },
    userInvalidCredential: {
        json: true,
        message: 'User invalid credentials',
        code: 4003,
        status: 422
    },
    usernameAlreadyUsed: {
        json: true,
        message: 'Username is already associated with another account',
        code: 4004,
        status: 422
    },

    invalidParameters: function (message, field = null) {
        const error = {
            json: true,
            message: message || 'Invalid parameters',
            code: 4005,
            status: 422
        };
        if(field !== null) {
            error.field = field;
        }
        return error;
    },

    insufficientPermission: {
        json: true,
        message: 'Insufficient permission',
        code: 4006,
        status: 403
    },

    serverError: {
        json: true,
        message: 'Server error',
        code: 5000,
        status: 500
    },
};
