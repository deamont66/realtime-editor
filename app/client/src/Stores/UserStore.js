import EventEmitter from 'event-emitter-es6';
import axios from '../Utils/Axios';

class UserStore extends EventEmitter {

    singIn(username, password) {
        return new Promise((resolve, reject) => {
            axios.post('/user/signIn', {
                username: username,
                password: password
            }).then((res) => {
                resolve(res.data.user);
                this.emitSync('value', res.data.user);
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
            axios.delete('/user/').then(() => {
                this.emit('value', null);
            }).then(() => {
                resolve();
            });
        });
    }
}

export default new UserStore();