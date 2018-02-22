const DocumentServer = require('./DocumentServer');

const WrappedOperation = require('../../client/src/OperationalTransformation/WrappedOperation');
const TextOperation = require('ot').TextOperation;
const Selection = require('ot').Selection;

/**
 * Socket.io implementation of EditorServer.
 */
class DocumentSocketIOServer extends DocumentServer {

    constructor(document, operations, documentId, mayWriteCallback) {
        super(document, operations);

        this.users = {};
        this.documentId = documentId;
        this.mayWriteCallback = mayWriteCallback || function (_, cb) {
            cb(true);
        };
    }

    addClient(socket) {
        socket
            .join(this.documentId)
            .emit('doc', {
                document: this.document,
                revision: this.operations.length,
                clients: this.users
            })
            .on('operation', (revision, operation, selection) => {
                this.mayWriteCallback(socket, (mayWrite) => {
                    if (!mayWrite) {
                        console.log("User doesn't have the right to edit.");
                        return;
                    }
                    this.onOperation(socket, revision, operation, selection);
                });
            })
            .on('selection', (obj) => {
                this.mayWriteCallback(socket, (mayWrite) => {
                    if (!mayWrite) {
                        console.log("User doesn't have the right to edit.");
                        return;
                    }
                    this.updateSelection(socket, obj && Selection.fromJSON(obj));
                });
            })
            .on('disconnect', (reason) => {
                console.log("Disconnect", reason);
                this.onDisconnect(socket);
                if (!Object.keys(socket.server.sockets.adapter.rooms).includes(this.documentId)) {
                    this.emit('empty-room');
                }
            });
    }

    onOperation(socket, revision, operation, selection) {
        let wrapped;
        try {
            wrapped = new WrappedOperation(
                TextOperation.fromJSON(operation),
                selection && Selection.fromJSON(selection)
            );
        } catch (exc) {
            console.error("Invalid operation received: " + exc);
            return;
        }

        try {
            const clientId = socket.id;
            const wrappedPrime = this.receiveOperation(revision, wrapped);
            console.log("new operation: ",  wrapped);
            this.getClient(clientId).selection = wrappedPrime.meta;
            socket.emit('ack');
            socket.to(this.documentId).emit(
                'operation', clientId,
                wrappedPrime.wrapped.toJSON(), wrappedPrime.meta
            );
        } catch (exc) {
            console.error(exc);
        }
    }

    updateSelection(socket, selection) {
        const clientId = socket.id;
        if (selection) {
            this.getClient(clientId).selection = selection;
        } else {
            delete this.getClient(clientId).selection;
        }
        socket.to(this.documentId).emit('selection', clientId, selection);
    }

    setName(socket, name) {
        const clientId = socket.id;
        this.getClient(clientId).name = name;
        socket.to(this.documentId).emit('set_name', clientId, name);
    }

    getClient(clientId) {
        return this.users[clientId] || (this.users[clientId] = {});
    }

    onDisconnect(socket) {
        const clientId = socket.id;
        delete this.users[clientId];
        socket.to(this.documentId).emit('client_left', clientId);
    }
}

module.exports = DocumentSocketIOServer;