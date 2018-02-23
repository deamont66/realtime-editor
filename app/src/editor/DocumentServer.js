const EventEmitter = require('events');

/**
 * Each instance represents single document.
 * This implementation holds current operation history in memory.
 */
class DocumentServer extends EventEmitter {

    /**
     * @param {String} value
     * @param {WrappedOperation[]} operationsHistory
     */
    constructor(value, operationsHistory = []) {
        super();
        this.value = value;
        this.operations = operationsHistory;
        this.revisionOffset = (operationsHistory[0] && operationsHistory[0].revision) || 0;
    }

    /**
     * Transforms received operation against all concurrent operations and applies it to document.
     * It's the caller's responsibility to send the operation to all connected
     * clients and an acknowledgement to the creator.
     *
     * @param {Number} revision
     * @param {WrappedOperation} operation
     *
     * @returns WrappedOperation transformed operation
     */
    receiveOperation(revision, operation) {
        operation = this.transformReceivedOperation(revision - this.revisionOffset, operation);

        this.applyReceivedOperation(operation);
        return operation;
    }

    /**
     * Transforms received operation.
     *
     * @param {Number} revision
     * @param operation
     * @returns {WrappedOperation}
     */
    transformReceivedOperation(revision, operation) {
        if (revision < 0 || this.operations.length < revision) {
            throw new Error("operation revision not in history");
        }
        // Find all operations that the client didn't know of when it sent the
        // operation ...
        const concurrentOperations = this.operations.slice(revision);

        // ... and transform the operation against all these operations.
        const transform = operation.constructor.transform;
        for (let i = 0; i < concurrentOperations.length; i++) {
            operation = transform(operation, concurrentOperations[i])[0];
        }
        return operation;
    }

    /**
     * Applies operation to the document
     *
     * @param {WrappedOperation} operation
     */
    applyReceivedOperation(operation) {
        // Apply operation to the document.
        this.value = operation.apply(this.value);
        // Store operation in history.
        this.operations.push(operation);
        // Emit document change event.
        this.emit('document_change', this.value, operation);
    }

    /**
     * Calculates real revision number.
     *
     * @return {number} revision
     */
    getRevision() {
        return this.operations.length + this.revisionOffset;
    }
}

module.exports = DocumentServer;
