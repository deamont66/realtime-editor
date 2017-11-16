
import AbstractStore from "./AbstractStore";
import axios from '../Utils/Axios';

class UserStore extends AbstractStore {

    singIn(username, password) {
        return new Promise((resolve, reject) => {
            axios.post('/user/signIn', {
                username: username,
                password: password
            }).then((res) => {
                resolve(res.data.user);
                this.notify(res.data.user);
            }).catch((res) => {
                reject(res);
            });
        });
    }

    singUp(username, password, name) {
        return new Promise((resolve, reject) => {
            axios.post('/user/', {
                username: username,
                password: password,
                name: name
            }).then((res) => {
                resolve(res.data.user);
                this.notify(res.data.user);
            }).catch((res) => {
                reject(res);
            });
        });
    }

    checkLoggedIn() {
        return new Promise((resolve) => {
            axios.get('/user/').then((res) => {
                this.notify(res.data.user);
            }).catch(() => {
                this.notify(null);
            }).then(() => {
                resolve();
            });
        });
    }

    logOut () {
        return new Promise((resolve) => {
            axios.delete('/user/').then((res) => {
                this.notify(null);
            }).then(() => {
                resolve();
            });
        });
    }
}

export default new UserStore();