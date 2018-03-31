import AbstractServerAdapter from './AbstractServerAdapter';

/**
 * Implementation of ServerAdapter for OT.js's EditorClient class.
 * @class
 */
class SocketIOAdapter extends AbstractServerAdapter {

    /**
     * Creates SocketIOAdapter based on socket.io's socket instance.
     *
     * @param {Socket} socket
     */
    constructor(socket) {
        super();
        this.socket = socket;

        socket
            .on('client_left', (clientId) => {
                this.emit('client_left', clientId);
            })
            .on('set_name', (clientId, name) => {
                this.emit('set_name', clientId, name);
            })
            .on('ack', () => {
                this.emit('ack');
            })
            .on('operation', (clientId, operation, selection) => {
                this.emit('operation', operation);
                this.emit('selection', clientId, selection);
            })
            .on('selection', (clientId, selection) => {
                this.emit('selection', clientId, selection);
            });
    }

    /**
     * Gets called for emitting new Operation to server.
     *
     * @param {Number} revision - last received revision number
     * @param {Operation} operation - operation
     * @param {Selection|null} selection - meta selection data
     */
    sendOperation(revision, operation, selection) {
        // console.log('emitted op: ', revision, operation);
        this.socket.emit('operation', revision, operation, selection);
    };

    /**
     * Gets called for emitting new Selection to server.
     *
     * @param {Selection|null} selection
     */
    sendSelection(selection) {
        this.socket.emit('selection', selection);
    };
}

export default SocketIOAdapter;
