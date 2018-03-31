import EventEmitter from 'event-emitter-es6';

/**
 * AbstractServerAdapter for EditorClient
 * @class
 *
 * EventEmitter events:
 *  - client_left   (clientId) - client left document
 *  - set_name      (clientId, name) - client name set
 *  - ack           () - server operation ack
 *  - operation     (operation) - received operation
 *  - selection     (clientId, selection) - received client selection change
 */
class AbstractServerAdapter extends EventEmitter {

    constructor() {
        super();

        if (new.target === AbstractServerAdapter) {
            throw new TypeError("Cannot construct AbstractServerAdapter instances directly");
        }
    }

    /**
     * Gets called for emitting new Operation to server.
     *
     * @param {Number} revision - last received revision number
     * @param {Operation} operation - operation
     * @param {Selection|null} selection - meta selection data
     */
    sendOperation(revision, operation, selection) {
        throw new TypeError("Must override sendOperation method");
    }

    /**
     * Gets called for emitting new Selection to server.
     *
     * @param {Selection|null} selection
     */
    sendSelection(selection) {
        throw new TypeError("Must override sendSelection method");
    }
}

export default AbstractServerAdapter;
