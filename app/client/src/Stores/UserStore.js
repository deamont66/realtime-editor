import EventEmitter from 'event-emitter-es6';
import axios from '../Utils/Axios';

class UserStore extends EventEmitter {

    singIn(username, password, rememberMe = false) {
        return new Promise((resolve, reject) => {
            axios.post('/auth/signIn', {
                username: username,
                password: password,
                rememberMe: rememberMe
            }).then((res) => {
                resolve(res.data.user);
                this.emitSync('value', res.data.user);
            }).catch((res) => {
                reject(res);
            });
        });
    }

    singUp(username, password, email) {
        return new Promise((resolve, reject) => {
            axios.post('/auth/', {
                username: username,
                password: password,
                email: email
            }).then((res) => {
                resolve(res.data.user);
                this.emitSync('value', res.data.user);
            }).catch((res) => {
                reject(res);
            });
        });
    }

    checkLoggedIn() {
        return new Promise((resolve) => {
            axios.get('/user/').then((res) => {
                this.emitSync('value', res.data.user);
            }).catch(() => {
                this.emitSync('value', null);
            }).then(() => {
                resolve();
            });
        });
    }

    logOut () {
        return new Promise((resolve) => {
            axios.delete('/auth/').then(() => {
                this.emit('value', null);
            }).then(() => {
                resolve();
            });
        });
    }
}

export default new UserStore();