const debug = require('debug')('editor:socketroomserrver');

const DocumentVoter = require('../security/DocumentVoter');
const DocumentRepository = require('../repositories/DocumentRepository');
const MessageRepository = require('../repositories/MessageRepository');
const OperationRepository = require('../repositories/OperationRepository');

const {WrappedOperation, TextOperation, Selection, DocumentServer, Signal} = require('operational-transformation-text');

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
        chr = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
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
     * @param revision
     */
    constructor(document, revision) {
        super(revision);

        this.documentId = document._id || document;
        this.users = {};
        this.roomEmpty = new Signal();
    }

    /**
     * Registers document message listeners on socket.
     * @param socket
     */
    initSocket(socket) {
        socket.join(this.documentId);

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
    }

    /**
     * Registers socket to the DocumentServer
     *
     * @param {Socket} socket - socket.io socket instance
     * @param {function} responseCallback - join/rejoin response callback
     * @param {Number|Boolean} nextRevision - in case of reconnection next expected revision number
     */
    addClient(socket, responseCallback, nextRevision = false) {
        DocumentRepository.getDocumentById(this.documentId).then(document => {
            this.initSocket(socket);

            Promise.all([
                DocumentVoter.getAllowedOperations(socket.request.user, document),
                MessageRepository.getLastMessages(this.documentId)
            ]).then(([operations, messages]) => {
                if (!operations.includes('view')) {
                    debug('Disconnected: Insufficient permission');
                    socket.emit('disconnect_error', 404);
                    socket.disconnect(true);
                    return;
                }

                if (socket.request.user.logged_in) {
                    DocumentRepository.updateUserAccess(document, socket.request.user).catch((err) => {
                        debug(err);
                    });
                }

                socket.to(this.documentId).emit('set_name', socket.id, this.getClient(socket).name);
                if (nextRevision === false) {
                    this.joinClient(document, operations, messages, responseCallback);
                } else {
                    this.rejoinClient(document, operations, messages, nextRevision, responseCallback);
                }
            });
        }).catch(() => {
            debug('Disconnected: Not found');
            socket.emit('disconnect_error', 404);
            socket.disconnect(true);
        });
    }

    /**
     * Calls responseCallback with join related data.
     *
     * @param {Document[]} document
     * @param {String[]} allowedOperations
     * @param {Message[]} messages
     * @param {function} responseCallback
     */
    joinClient(document, allowedOperations, messages, responseCallback) {
        OperationRepository.updateCacheAndGetCurrentContent(document).then((newDocument) => {
            responseCallback({
                value: newDocument.cacheContent,
                revision: newDocument.cacheRevision,
                clients: this.users,
                settings: Object.assign({title: document.title}, document.settings.toJSON()),
                operations: allowedOperations,
                messages: allowedOperations.includes('chat') ? messages : [],
            });
        });
    }

    /**
     * Calls responseCallback with rejoin related data.
     *
     * @param {Document[]} document
     * @param {String[]} allowedOperations
     * @param {Message[]} messages
     * @param {Number} revision
     * @param {function} responseCallback
     */
    rejoinClient(document, allowedOperations, messages, revision, responseCallback) {
        OperationRepository.getOperationsAfterRevisionByDocument(document, revision).then((documentOperations) => {
            responseCallback({
                documentOperations: documentOperations,
                clients: this.users,
                settings: Object.assign({title: document.title}, document.settings.toJSON()),
                operations: allowedOperations,
                messages: allowedOperations.includes('chat') ? messages : [],
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
        this.getDocumentAndValidateRights('write', socket).then(async (document) => {
            const wrapped = createFromJSON(operationJSON, selectionJSON);
            if (!wrapped) return;

            try {
                const transformedWrapped = await this.receiveOperation(revision, wrapped);
                this.currentRevision++;
                socket.emit('ack');
                socket.to(this.documentId)
                    .emit('operation', socket.id, transformedWrapped.operation.toJSON(), transformedWrapped.selection);

                this.getClient(socket).selection = transformedWrapped.selection;
                this.onDocumentChange(socket, document, transformedWrapped.operation);
            } catch (exc) {
                debug(exc);
            }
        }).catch((errorCode) => {
            socket.emit('disconnect_error', errorCode);
            socket.disconnect(true);
        });
    }

    /**
     * Handles incoming selection range from client.
     *
     * @param {Socket} socket - socket.io socket instance
     * @param {Selection} selectionJSON - new serialized Selection range from client
     */
    onSelection(socket, selectionJSON) {
        this.getDocumentAndValidateRights('write', socket).then(() => {
            const selection = selectionJSON && Selection.fromJSON(selectionJSON);
            this.getClient(socket).selection = selection;
            socket.to(this.documentId).emit('selection', socket.id, selection);
        }).catch((errorCode) => {
            socket.emit('disconnect_error', errorCode);
            socket.disconnect(true);
        });
    }

    /**
     * Handle incoming document settings from client.
     *
     * @param {Socket} socket - socket.io socket instance
     * @param {Object} settings - DocumentSettings object with title field
     */
    onSettings(socket, settings) {
        this.getDocumentAndValidateRights('write', socket).then((document) => {
            socket.nsp.to(this.documentId).emit('settings', settings);
            DocumentRepository.updateSettings(document, settings);
        }).catch((errorCode) => {
            socket.emit('disconnect_error', errorCode);
            socket.disconnect(true);
        });
    }

    /**
     * Handles incoming chat message from client.
     *
     * @param {Socket} socket
     * @param {String} message
     * @param {function} callback
     */
    onMessage(socket, message, callback) {
        this.getDocumentAndValidateRights('chat', socket).then((document) => {
            MessageRepository.createMessage(document, socket.request.user, message).then((messageObj) => {
                socket.to(this.documentId).emit('chat_message', messageObj);
                callback(messageObj);
            });
        }).catch((errorCode) => {
            socket.emit('disconnect_error', errorCode);
            socket.disconnect(true);
        });
    }

    /**
     * Persists document change to DB
     *
     * @param {Socket} socket - socket.io socket instance
     * @param {Document} document - document instance
     * @param {TextOperation} operation - new operation to store
     */
    onDocumentChange(socket, document, operation) {
        const revision = this.getRevision();
        DocumentRepository.updateLastChange(document);
        OperationRepository.saveOperation(document, socket.request.user.logged_in ? socket.request.user : null, revision, operation);
    }

    /**
     * Handles user disconnect.
     *
     * @param {Socket} socket - socket.io socket instance
     */
    onDisconnect(socket) {
        if (!Object.keys(socket.server.sockets.adapter.rooms).includes(this.documentId)) {
            this.roomEmpty.emit();
        }
        console.log('Disconnected: ', socket.id);
        delete this.users[socket.id];
        socket.to(this.documentId).emit('client_left', socket.id);
    }

    /**
     * Gets current document from DB and checks rights of current user.
     *
     * @param {String} right
     * @param {Socket} socket
     * @return {Promise<Document>} - or rejects with 403/404 error
     */
    getDocumentAndValidateRights(right, socket) {
        let found = false;
        return DocumentRepository.getDocumentById(this.documentId).then((document) => {
            found = true;
            return DocumentVoter.can(right, socket.request.user, document).then(() => {
                return document;
            });
        }).catch(() => {
            return Promise.reject(found ? 403 : 404);
        });
    }

    /**
     * Returns client data.
     *
     * @param {Socket} socket - socket.io socket instance
     * @return {object}
     */
    getClient(socket) {
        return this.users[socket.id] || (this.users[socket.id] = {});
    }

    getOperationsAfterRevision(revision) {
        return OperationRepository.getOperationsAfterRevisionByDocument(this.document, revision);
    }
}

module.exports = DocumentSocketIOServer;