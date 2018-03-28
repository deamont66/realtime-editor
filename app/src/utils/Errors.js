module.exports = {
    notFound: {
        json: true,
        message: 'error.not_found',
        code: 4000,
        status: 404
    },
    userAlreadyLoggedIn: {
        json: true,
        message: 'error.user_already_logged_in',
        code: 4001,
        status: 422
    },
    userNotLoggedIn: {
        json: true,
        message: 'error.user_not_logged_in',
        code: 4002,
        status: 200 // should be 422, but React user pooling spams Chrome console with errors
    },
    userInvalidCredential: {
        json: true,
        message: 'password.validation.invalid_credentials',
        code: 4003,
        status: 422
    },
    usernameAlreadyUsed: {
        json: true,
        message: 'username.validation.already_used',
        code: 4004,
        status: 422
    },
    fieldAlreadyUsed: {
        json: true,
        message: 'error.field_already_used',
        code: 4005,
        status: 422
    },


    invalidParameters: function (message, field = null) {
        const error = {
            json: true,
            message: message || 'error.invalid_parameters',
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
        message: 'error.insufficient_permission',
        code: 4006,
        status: 403
    },

    cannotInviteDocumentOwner: {
        json: true,
        message: 'error.cannot_invite_owner',
        code: 4007,
        status: 422
    },

    forgetPasswordResponse: {
        json: true,
        message: 'error.forgot_password_response',
        status: 200
    },

    serverError: {
        json: true,
        message: 'error.server_error',
        code: 5000,
        status: 500
    },
};
