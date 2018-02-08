import EventEmitter from 'event-emitter-es6';
import io from 'socket.io-client';

class DocumentStore extends EventEmitter {

    constructor() {
        super();

        this.socket = null;
        this.lastMessages = {};
    }

    emitAndSave(event, data) {
        this.lastMessages[event] = data;
        this.emit(event, data);
    }

    last(event, callback = false) {
        if (this.lastMessages[event]) {
            if (callback) {
                callback(this.lastMessages[event]);
            } else {
                return this.lastMessages[event];
            }
        }
    }

    connect(documentId) {
        if (this.socket !== null)
            this.disconnect();

        this.socket = io({
            path: '/api/socket.io',
            query: 'documentId=' + documentId
        });

        this.socket.on('connect', () => {
            this.socket.emit('init', (value, setting, error) => {
                if (error) {
                    this.emitAndSave('error', error);
                } else {
                    this.emitAndSave('value', value);
                    this.emitAndSave('settings', setting);
                }
            });
            this.emit('connect');
        });

        this.socket.on('revision');
        this.socket.on('value');
        this.socket.on('cursor');
        this.socket.on('settings');
        this.socket.on('message');
    }

    disconnect() {
        if(this.socket)
            this.socket.close();
        this.socket = null;
    }
}

export default new DocumentStore();