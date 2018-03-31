import io from 'socket.io-client';
import {TextOperation} from 'ot';
import {SocketIOAdapter, EditorClient, CodeMirrorEditorAdapter} from '../../OperationalTransformation';

import createColor from '../../Utils/ColorGenerator';

class ClientSocket {

    constructor(documentId, onStateChange) {
        this.documentId = documentId;
        this.onStateChange = onStateChange;

        this.editorClient = null;
    }

    connect() {
        if (this.socket) this.socket.close();
        this.socket = io('/documents', {
            path: '/api/socket.io',
            query: 'documentId=' + this.documentId
        });

        this.socket.on('connect', () => {
            this.onStateChange({
                connected: true,
                disconnected: false
            });

            const isReconnect = !!this.editorClient;
            if (isReconnect) {
                this.socket.emit('rejoin', this.editorClient.revision, this.onConnect(isReconnect).bind(this));
            } else {
                this.socket.emit('join', this.onConnect(isReconnect).bind(this));
            }
        });

        this.socket.on('disconnect_error', error => {
            console.log(error);
            this.onStateChange({
                error: error
            })
        });

        this.socket.on('disconnect', () => {
            this.onStateChange({
                disconnected: true
            })
        });

        this.socket.on('settings', (settings) => {
            this.onSettings(settings);
        });

        this.socket.on('chat_message', (messageObj) => {
            this.addChatMessage(messageObj);
        });
    }

    onConnect = isReconnect => (obj) => {
        console.log(isReconnect, obj);
        if (!isReconnect) {
            this.init(obj.value, obj.revision, obj.clients);
        } else {
            this.reconnect(obj.documentOperations, obj.clients);
        }

        this.onSettings(obj.settings);

        this.onStateChange({
            messages: [],
            allowedOperations: obj.operations
        }, () => {
            obj.messages.forEach((message) => this.addChatMessage(message));
        });
    };

    getSocket = () => {
        return this.socket;
    };

    setEditor = (editor) => {
        this.editor = editor;
    };

    close = () => {
        this.socket.close();
    };

    init = (str, revision, clients) => {
        if (!this.editorClient) {
            this.editorClient = new EditorClient(
                revision, clients, new SocketIOAdapter(this.socket), new CodeMirrorEditorAdapter(this.editor)
            );
            this.editorClient.emitter.on('stateChange', (state) => {
                this.onStateChange({
                    clientState: state
                });
            });
            this.editorClient.emitter.on('clientsChanged', (clients) => {
                this.onStateChange({
                    clients: Object.keys(clients).map((clientId) => {
                        return Object.assign({
                            id: clientId
                        }, clients[clientId]);
                    })
                });
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
        this.onStateChange({
            settings: settings
        });
    };

    handleSettingsChange = (settings) => {
        this.onStateChange((oldState) => {
            this.socket.emit('settings', Object.assign({}, oldState.settings, settings));
            return {};
        });
    };

    addChatMessage = (messageObj) => {
        messageObj.user.color = createColor(messageObj.user.username);
        this.onStateChange((oldState) => {
            return {
                messages: [...oldState.messages, messageObj]
            };
        });
    };

    handleMessageSubmit = (message, callback) => {
        this.socket.emit('chat_message', message, (messageObj) => {
            this.addChatMessage(messageObj);
            callback();
        });
    };
}

export default ClientSocket;