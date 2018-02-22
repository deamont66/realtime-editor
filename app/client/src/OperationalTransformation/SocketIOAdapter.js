class SocketIOAdapter {
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
                console.log('recieved op: ', operation);
                this.trigger('operation', operation);
                this.trigger('selection', clientId, selection);
            })
            .on('selection', (clientId, selection) => {
                this.trigger('selection', clientId, selection);
            })
            .on('reconnect', () => {
                // this.trigger('reconnect');
            });
    }

    sendOperation(revision, operation, selection) {
        console.log('emitted op: ', revision, operation);
        this.socket.emit('operation', revision, operation, selection);
    };

    sendSelection(selection) {
        this.socket.emit('selection', selection);
    };

    registerCallbacks(cb) {
        this.callbacks = cb;
    };

    trigger(event) {
        const args = Array.prototype.slice.call(arguments, 1);
        const action = this.callbacks && this.callbacks[event];
        if (action) {
            action.apply(this, args);
        }
    };
}

export default SocketIOAdapter;
