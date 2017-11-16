
export default class AbstractStore {

    constructor() {
        this.listeners = [];
    }

    registerChangeListener(listener) {
        this.listeners.push(listener);
    }

    removeChangeListener(listener) {
        this.listeners = this.listeners.filter((l) => l !== listener);
    }

    notify(...args) {
        this.listeners.forEach((listener) => {
           listener.call(undefined, ...args);
        });
    }

}
