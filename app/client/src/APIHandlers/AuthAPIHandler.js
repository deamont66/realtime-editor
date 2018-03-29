import axios from '../Utils/Axios';

class AuthAPIHandler {

    static fetchSignOut() {
        return axios.delete('/auth/');
    }

    static fetchSignUp(username, password, email) {
        return axios.post('/auth/', {
            username,
            password,
            email
        });
    }

    static fetchSignIn(username, password, rememberMe) {
        return axios.post('/auth/signIn', {
            username,
            password,
            rememberMe
        });
    }

    static fetchDisconnectAccount(url) {
        return axios.delete(`/auth/${url}`);
    }

    static fetchRequestForgotPassword(username, email) {
        return axios.post('/auth/forgotPassword', {
            username,
            email,
        });
    }

    static fetchValidateForgotPasswordToken(token) {
        return axios.get('/auth/forgotPassword/' + token);
    }

    static fetchChangeForgotPassword(token, newPassword) {
        return axios.put('/auth/forgotPassword/' + token, {
            newPassword
        });
    }
}

export default AuthAPIHandler;
