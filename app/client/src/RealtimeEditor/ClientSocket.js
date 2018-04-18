import io from 'socket.io-client';
import EventEmitter from 'event-emitter-es6';
import {TextOperation} from 'ot';

import {SocketIOServerAdapter, EditorClient, CodeMirrorEditorAdapter} from '../OperationalTransformation';

import createColor from '../Utils/ColorGenerator';

/**
 * Event types:
 *
 * connect - fired on document room (re)join with object response data
 * disconnect - fired on socket disconnected
 * error - fired on disconnect_error message from server
 * state - fired on client state change
 * clients - fired on clients change
 * settings - fired on settings change
 * message - fired on incoming new message
 */
class ClientSocket extends EventEmitter {

    constructor(documentId) {
        super();
        this.documentId = documentId;

        this.editorClient = null;
        this.socket = null;
    }

    close = () => {
        if (this.socket) this.socket.close();
    };

    connect() {
        if(!this.editor) {
            throw new TypeError('Called connect without setting CodeMirror editor instance by setEditor first.');
        }

        if (this.socket) this.socket.close();
        this.socket = io('/documents', {
            path: '/api/socket.io',
            query: 'documentId=' + this.documentId
        });

        this.socket.on('connect', () => {
            const isReconnect = !!this.editorClient;
            if (isReconnect) {
                this.socket.emit('rejoin', this.editorClient.revision, this.onConnect(isReconnect).bind(this));
            } else {
                this.socket.emit('join', this.onConnect(isReconnect).bind(this));
            }
        });

        this.socket.on('disconnect_error', error => {
            console.error(error);
            this.emit('error', error);
        });

        this.socket.on('disconnect', () => {
            this.emit('disconnect');
        });

        this.socket.on('settings', (settings) => {
            this.onSettings(settings);
        });

        this.socket.on('chat_message', (messageObj) => {
            this.onChatMessage(messageObj);
        });
    }

    setEditor = (editor) => {
        this.editor = editor;
    };

    getSocket = () => {
        return this.socket;
    };

    onConnect = isReconnect => (obj) => {
        if (!isReconnect) {
            this.init(obj.value, obj.revision, obj.clients);
        } else {
            this.reconnect(obj.documentOperations, obj.clients);
        }

        this.emit('connect', obj);
    };

    init = (str, revision, clients) => {
        if (!this.editorClient) {
            this.editorClient = new EditorClient(
                revision, clients, new SocketIOServerAdapter(this.socket), new CodeMirrorEditorAdapter(this.editor)
            );
            this.editorClient.emitter.on('stateChange', (state) => {
                this.emit('state', state);
            });
            this.editorClient.emitter.on('clientsChanged', (clients) => {
                const clientsWithId = Object.keys(clients).map((clientId) => {
                    return Object.assign({id: clientId}, clients[clientId]);
                });
                this.emit('clients', clientsWithId);
            });
        }
        if (str) {
            this.editorClient.editorAdapter.ignoreNextChange = true;
            this.editor.setValue(str);
        }
    };

    reconnect = (documentOperations, clients) => {
        documentOperations.forEach((operation) => {
            this.editorClient.applyServer(TextOperation.fromJSON(operation));
        });
        this.editorClient.setClients(clients);
    };

    onSettings = (settings) => {
        this.emit('settings', settings);
    };

    onChatMessage = (messageObj) => {
        messageObj.user.color = createColor(messageObj.user.username);
        this.emit('message', messageObj);
    };

    sendSettings = (settings) => {
        this.socket.emit('settings', settings);
    };

    sendMessage = (message, callback) => {
        this.socket.emit('chat_message', message, (messageObj) => {
            this.onChatMessage(messageObj);
            callback();
        });
    };
}

export default ClientSocket;