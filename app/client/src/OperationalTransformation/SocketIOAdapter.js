/**
 * Implementation of ServerAdapter for OT.js's EditorClient class.
 */
class SocketIOAdapter {

    /**
     * Creates SocketIOAdapter based on socket.io's socket instance.
     *
     * @param {Socket} socket
     */
    constructor(socket) {
        this.socket = socket;

        socket
            .on('client_left', (clientId) => {
                this.trigger('client_left', clientId);
            })
            .on('set_name', (clientId, name) => {
                this.trigger('set_name', clientId, name);
            })
            .on('ack', () => {
                this.trigger('ack');
            })
            .on('operation', (clientId, operation, selection) => {
                // console.log('recieved op: ', operation);
                this.trigger('operation', operation);
                this.trigger('selection', clientId, selection);
            })
            .on('selection', (clientId, selection) => {
                this.trigger('selection', clientId, selection);
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

    /**
     * Receives callbacks to be called when event happened.
     *
     * @param {function[]} cb - callbacks
     */
    registerCallbacks(cb) {
        this.callbacks = cb;
    };

    /**
     * Calls registered callback for event with arguments.
     *
     * @param {String} event - event name
     */
    trigger(event) {
        const args = Array.prototype.slice.call(arguments, 1);
        const actionCallback = this.callbacks && this.callbacks[event];
        if (actionCallback) {
            actionCallback.apply(this, args);
        }
    };
}

export default SocketIOAdapter;
