
const debug = require('debug')('editor:roomlist');

class RoomList {

    constructor(io) {
        this.rooms = {};

        io.on('connection', (socket) => {
            debug('Document incoming socket:', socket.handshake.query.documentId, socket.handshake.session.uid);

            if(!socket.request.user.is_logged_in) {
                socket.disconnect(true, );
            }
        });
    }
}

module.exports = RoomList;