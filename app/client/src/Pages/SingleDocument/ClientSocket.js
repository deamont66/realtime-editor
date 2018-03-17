import io from "socket.io-client";
import SocketIOAdapter from "../../OperationalTransformation/SocketIOAdapter";
import createColor from "../../Utils/ColorGenerator";
import EditorClient from "../../OperationalTransformation/EditorClient";
import CodeMirrorAdapter from "../../OperationalTransformation/CodeMirrorAdapter";

class ClientSocket {

    constructor(documentId, onStateChange) {
        this.documentId = documentId;
        this.onStateChange = onStateChange;
    }

    connect() {
        this.socket = io('/documents', {
            path: '/api/socket.io',
            query: 'documentId=' + this.documentId
        });

        this.socket.on('connect', () => {
            this.onStateChange({
                connected: true,
                disconnected: false
            });

            this.socket.emit('join', (obj) => {
                console.log(obj);
                this.init(obj.value, obj.revision, obj.clients, this.editorClient ? this.editorClient.serverAdapter : new SocketIOAdapter(this.socket));
                this.onSettings(obj.settings);

                this.onStateChange({
                    messages: [],
                    allowedOperations: obj.operations
                }, () => {
                    obj.messages.forEach((message) => this.addChatMessage(message));
                });
            });
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

    getSocket = () => {
        return this.socket;
    };

    setEditor = (editor) => {
        this.editor = editor;
    };

    close = () => {
        this.socket.close();
    };

    init = (str, revision, clients, serverAdapter) => {
        if (this.editorClient) {
            this.editorClient.editorAdapter.detach();
        }
        this.editor.setValue(str);
        this.editorClient = new EditorClient(
            revision, clients, serverAdapter, new CodeMirrorAdapter(this.editor)
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