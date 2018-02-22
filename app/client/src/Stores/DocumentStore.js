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
        } else {
            return false;
        }
    }

    connect(documentId) {
        this.emit('connect');

        return;
        if (this.socket !== null)
            this.disconnect();

        this.socket = io({
            path: '/api/socket.io',
            query: 'documentId=' + documentId
        });

        this.socket.on('connect', () => {
            this.socket.on('doc', (data) => {
                this.emitAndSave('value', data.document);
            });

            this.socket.emit('joinRoom', { room: documentId, username: 'username' });

            /*this.socket.emit('init', documentId, (value, setting, error) => {
                if (error) {
                    this.emitAndSave('error', error);
                } else {
                    this.emitAndSave('value', value);
                    this.emitAndSave('settings', setting);
                }
            });*/

            // this.emit('connect');
        });

        this.socket.on('disconnect', () => this.emit('disconnect'));

        this.socket.on('settings', (settings) => this.emitAndSave('settings', settings));
    }

    disconnect() {
        if(this.socket)
            this.socket.close();
        this.socket = null;
    }

    updateSettings(update) {
        if(this.last('settings')) {
            const newSettings = Object.assign({}, this.last('settings'), update);
            this.socket.emit('settings', newSettings);
        }
    }
}

export default new DocumentStore();