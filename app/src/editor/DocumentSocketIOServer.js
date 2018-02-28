const debug = require('debug')('editor:socketroomserrver');

const DocumentServer = require('./DocumentServer');
const DocumentRepository = require('../repositories/DocumentRepository');
const OperationRepository = require('../repositories/OperationRepository');

const WrappedOperation = require('../../client/src/OperationalTransformation/WrappedOperation');
const TextOperation = require('ot').TextOperation;
const Selection = require('ot').Selection;

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
        this.getClient(socket).name = socket.request.user.username;

        socket.on('operation', (revision, operation, selection) => {
            this.onOperation(socket, revision, operation, selection);
        });

        socket.on('selection', (selection) => {
            this.onSelection(socket, selection);
        });

        socket.on('settings', (settings) => {
            this.onSettings(socket, settings);
        });

        socket.on('disconnect', () => {
            this.onDisconnect(socket);
        });

        socket.to(this.document._id).emit('set_name', socket.id, this.getClient(socket).name);

        DocumentRepository.updateUserAccess(this.document, socket.request.user).catch((err) => {
            debug(err);
        });

        responseCallback({
            value: this.value,
            revision: this.getRevision(),
            clients: this.users,
            settings: Object.assign({title: this.document.title}, this.document.settings.toJSON())
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
        const selection =  selectionJSON && Selection.fromJSON(selectionJSON);
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
        socket.nsp.to(this.document._id).emit('settings', settings);
        DocumentRepository.updateSettings(this.document, settings).then((document) => {
            this.document = document;
        });
    }

    /**
     * Persists document change to DB
     *
     * @param {Socket} socket - socket.io socket instance
     * @param {TextOperation} operation - new operation to store
     */
    onDocumentChange(socket, operation) {
        const revision = this.getRevision();
        DocumentRepository.updateLastContent(this.document, this.value).then((document) => {
            this.document = document;
        });
        OperationRepository.saveOperation(this.document, socket.request.user, revision, operation);
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