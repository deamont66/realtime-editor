
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
                debug('Disconnected: not logged in');
                socket.disconnect(true, 'Not logged in');
            }

            this.getDocumentServer(documentId).then((server) => {
                socket.on('join', (cb) => {
                    debug('Joining:', documentId, socket.request.user._id);
                    server.addClient(socket, cb);
                });
            }).catch((error) => {
                debug('Disconnected:', error);
                socket.disconnect(true, error);
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
                return Promise.reject('document not found')
            }
            return Promise.resolve(this.rooms[documentId]).then((server) => {
                if(!server) {
                    return OperationRepository.getLastOperationsByDocument(documentId).then((operations) => {
                        this.rooms[documentId] = new DocumentSocketIOServer(document, operations);
                        return this.rooms[documentId]
                    });
                }
                return server;
            });
        });

    }
}

module.exports = RoomList;