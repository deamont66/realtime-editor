
const debug = require('debug')('editor:roomlist');
const DocumentSocketIOServer = require('./DocumentSocketIOServer');

const DocumentRepository = require('../repositories/DocumentRepository');
const OperationRepository = require('../repositories/OperationRepository');

class RoomList {

    /**
     * @param io Socket.io namespace
     */
    constructor(io) {
        this.rooms = {};

        io.on('connection', (socket) => {
            const documentId = socket.handshake.query.documentId;
            debug('Incoming socket:', socket.handshake.address, documentId, socket.request.user._id);

            if(!socket.request.user.logged_in) {
                debug('Disconnected: Not logged in');
                socket.emit('disconnect_error', 401);
                socket.disconnect(true);
                return;
            }

            this.getDocumentServer(documentId).then((server) => {
                socket.on('join', (cb) => {
                    debug('Joining:', documentId, socket.request.user._id);
                    server.addClient(socket, cb);
                });
            }).catch(() => {
                debug('Disconnected: Document not found');
                socket.disconnect(true);
                socket.emit('disconnect_error', 404);
            });
        });
    }

    /**
     * Retrieves or creates DocumentServer instance for given documentId.
     * @param {mongoose.Types.ObjectId} documentId
     *
     * @returns {Promise} DocumentServer instance
     */
    getDocumentServer(documentId) {
        return DocumentRepository.getDocumentById(documentId).then((document) => {
            if(!document) {
                return Promise.reject();
            }
            return Promise.resolve(this.rooms[documentId]).then((server) => {
                if(!server) {
                    return OperationRepository.getLastOperationsByDocument(documentId).then((operations) => {
                        this.rooms[documentId] = new DocumentSocketIOServer(document, operations);
                        return this.rooms[documentId];
                    });
                }
                return server;
            });
        });

    }
}

module.exports = RoomList;