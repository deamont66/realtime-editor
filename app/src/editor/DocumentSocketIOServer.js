const debug = require('debug')('editor:socketroomserrver');

const DocumentServer = require('./DocumentServer');
const DocumentVoter = require('../security/DocumentVoter');
const DocumentRepository = require('../repositories/DocumentRepository');
const MessageRepository = require('../repositories/MessageRepository');
const OperationRepository = require('../repositories/OperationRepository');

const WrappedOperation = require('../../client/src/OperationalTransformation/WrappedOperation');
const TextOperation = require('ot').TextOperation;
const Selection = require('ot').Selection;

const animals = require('./animals');

/** Creates WrappedOperation from JSON serialized TextOperation and Selection */
function createFromJSON(operation, selection) {
    try {
        return new WrappedOperation(
            TextOperation.fromJSON(operation),
            selection && Selection.fromJSON(selection)
        );
    } catch (exc) {
        debug("Invalid operation received: " + exc);
    }
}

/**
 * Java like String hashCOde function
 * Source: http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 * @param {String} string
 * @returns {Number} computed hash
 */
function hashCode(string) {
    let hash = 0, i, chr;
    if (string.length === 0) return hash;
    for (i = 0; i < string.length; i++) {
        chr   = string.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

/**
 * Returns random animal name based on given seed value.
 * @param {String} seed
 * @returns {String} random animal
 */
function getAnimalNameFromSeed(seed) {
    return animals[Math.abs(hashCode(seed)) % animals.length];
}

/**
 * Socket.io implementation of EditorServer.
 */
class DocumentSocketIOServer extends DocumentServer {

    /**
     * @param document
     * @param operations
     */
    constructor(document, operations) {
        super(document.lastAckContent, operations);

        this.document = document;
        this.users = {};
    }

    /**
     * Registers socket to the DocumentServer
     *
     * @param {Socket} socket - socket.io socket instance
     * @param {function} responseCallback - join/rejoin response callback
     */
    addClient(socket, responseCallback) {
        socket.join(this.document._id);

        this.getClient(socket).name = socket.request.user.username || `Anonymous ${getAnimalNameFromSeed(socket.handshake.sessionID)}`;

        socket.on('operation', (revision, operation, selection) => {
            this.onOperation(socket, revision, operation, selection);
        });

        socket.on('selection', (selection) => {
            this.onSelection(socket, selection);
        });

        socket.on('settings', (settings) => {
            this.onSettings(socket, settings);
        });

        socket.on('chat_message', (message, callback) => {
            this.onMessage(socket, message, callback);
        });

        socket.on('disconnect', () => {
            this.onDisconnect(socket);
        });

        socket.to(this.document._id).emit('set_name', socket.id, this.getClient(socket).name);

        if (socket.request.user.logged_in) {
            DocumentRepository.updateUserAccess(this.document, socket.request.user).catch((err) => {
                debug(err);
            });
        }

        Promise.all([
            DocumentVoter.getAllowedOperations(socket.request.user, this.document),
            MessageRepository.getLastMessages(this.document)
        ]).then(([operations, messages]) => {
            if (!operations.includes('view')) {
                debug('Disconnected: Insufficient permission');
                socket.emit('disconnect_error', 404);
                socket.disconnect(true);
                return;
            }
            responseCallback({
                value: this.value,
                revision: this.getRevision(),
                clients: this.users,
                settings: Object.assign({title: this.document.title}, this.document.settings.toJSON()),
                operations: operations,
                messages: operations.includes('chat') ? messages : [],
            });
        });
    }

    /**
     * Handles incoming operation from client.
     *
     * @param {Socket} socket - socket.io socket instance
     * @param {Number} revision last revision number received from client
     * @param {TextOperation} operationJSON - new serialized TextOperation from client
     * @param {Selection} selectionJSON - new serialized Selection range from client
     */
    onOperation(socket, revision, operationJSON, selectionJSON) {
        const wrapped = createFromJSON(operationJSON, selectionJSON);
        if (!wrapped) return;

        try {
            const transformedWrapped = this.receiveOperation(revision, wrapped);
            socket.emit('ack');
            socket.to(this.document._id)
                .emit('operation', socket.id, transformedWrapped.wrapped.toJSON(), transformedWrapped.meta);

            this.getClient(socket).selection = transformedWrapped.meta;
            this.onDocumentChange(socket, transformedWrapped.wrapped);
        } catch (exc) {
            debug(exc);
        }
    }

    /**
     * Handles incoming selection range from client.
     *
     * @param {Socket} socket - socket.io socket instance
     * @param {Selection} selectionJSON - new serialized Selection range from client
     */
    onSelection(socket, selectionJSON) {
        const selection = selectionJSON && Selection.fromJSON(selectionJSON);
        this.getClient(socket).selection = selection;
        socket.to(this.document._id).emit('selection', socket.id, selection);
    }

    /**
     * Handle incoming document settings from client.
     *
     * @param {Socket} socket - socket.io socket instance
     * @param {Object} settings - DocumentSettings object with title field
     */
    onSettings(socket, settings) {
        DocumentVoter.can('write', socket.request.user, this.document).then(() => {
            socket.nsp.to(this.document._id).emit('settings', settings);
            DocumentRepository.updateSettings(this.document, settings).then((document) => {
                this.document = document;
            });
        }).catch(() => {
            socket.emit('disconnect_error', 403);
        });
    }

    onMessage(socket, message, callback) {
        DocumentVoter.can('chat', socket.request.user, this.document).then(() => {
            MessageRepository.createMessage(this.document, socket.request.user, message).then((messageObj) => {
                socket.to(this.document._id).emit('chat_message', messageObj);
                callback(messageObj);
            });
        }).catch(() => {
            socket.emit('disconnect_error', 403);
        });
    }

    /**
     * Persists document change to DB
     *
     * @param {Socket} socket - socket.io socket instance
     * @param {TextOperation} operation - new operation to store
     */
    onDocumentChange(socket, operation) {
        DocumentVoter.can('write', socket.request.user, this.document).then(() => {
            const revision = this.getRevision();
            DocumentRepository.updateLastContent(this.document, this.value).then((document) => {
                this.document = document;
            });
            OperationRepository.saveOperation(this.document, socket.request.user, revision, operation);
        }).catch(() => {
            socket.emit('disconnect_error', 403);
        });
    }

    /**
     * Returns client data.
     *
     * @param {Socket} socket - socket.io socket instance
     * @return {object|{}}
     */
    getClient(socket) {
        return this.users[socket.id] || (this.users[socket.id] = {});
    }

    /**
     * Handles user disconnect.
     *
     * @param {Socket} socket - socket.io socket instance
     */
    onDisconnect(socket) {
        if (!Object.keys(socket.server.sockets.adapter.rooms).includes(this.document._id)) {
            this.emit('empty-room');
        }

        delete this.users[socket.id];
        socket.to(this.document._id).emit('client_left', socket.id);
    }
}

module.exports = DocumentSocketIOServer;