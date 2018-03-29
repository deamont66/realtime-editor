import EventEmitter from 'event-emitter-es6';
import UserAPIHandler from '../APIHandlers/UserAPIHandler';
import AuthAPIHandler from '../APIHandlers/AuthAPIHandler';

class UserStore extends EventEmitter {

    singIn(username, password, rememberMe = false) {
        return new Promise((resolve, reject) => {
            AuthAPIHandler.fetchSignIn(username, password, rememberMe).then((res) => {
                resolve(res.data.user);
                this.emitSync('value', res.data.user);
            }).catch((res) => {
                reject(res);
            });
        });
    }

    singUp(username, password, email) {
        return new Promise((resolve, reject) => {
            AuthAPIHandler.fetchSignUp(username, password, email).then((res) => {
                resolve(res.data.user);
                this.emitSync('value', res.data.user);
            }).catch((res) => {
                reject(res);
            });
        });
    }

    checkLoggedIn() {
        return new Promise((resolve) => {
            UserAPIHandler.fetchUserInfo().then((res) => {
                resolve(res.data.user);
                this.emitSync('value', res.data.user);
            }).catch(() => {
                resolve(null);
                this.emitSync('value', null);
            });
        });
    }

    logOut () {
        return new Promise((resolve) => {
            AuthAPIHandler.fetchSignOut().then(() => {
                this.emit('value', null);
            }).then(() => {
                resolve();
            });
        });
    }
}

export default new UserStore();