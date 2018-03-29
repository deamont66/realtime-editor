import axios from '../Utils/Axios';

class UserAPIHandler {

    static fetchUserInfo() {
        return axios.get('/user/');
    }

    static fetchUpdateUser(data) {
        return axios.put('/user', data);
    }

    static fetchDefaultDocumentSettings() {
        return axios.get('/user/document-settings');
    }

    static fetchUpdateDefaultDocumentSettings(settings) {
        return axios.put('/user/document-settings', {
            settings
        });
    }
}

export default UserAPIHandler;
