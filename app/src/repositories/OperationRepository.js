const Operation = require('../model/Operation');

const WrappedOperation = require('../../client/src/OperationalTransformation/WrappedOperation');
const TextOperation = require('ot').TextOperation;

/**
 * Gets last n operations by document.
 *
 * @param {ObjectId|String|Document} documentId
 * @param {Number} last
 * @return {Promise<WrappedOperation[]>}
 */
const getLastOperationsByDocument = (documentId, last = 50) => {
    return Operation.find({
        document: documentId,
    }).sort('field -created').limit(last).exec().then((dbOperations) => {
        return dbOperations.map((dbOperation) => {
            return new WrappedOperation(TextOperation.fromJSON(JSON.parse(dbOperation.operations)), null);
        });
    });
};

/**
 * Gets all document operations after given revision.
 *
 * @param {ObjectId|String|Document} documentId
 * @param {Number} revisionNumber
 * @return {Promise<TextOperation[]>}
 */
const getOperationsAfterRevisionByDocument = (documentId, revisionNumber) => {
    return Operation.find({
        document: documentId,
        revision: {$gt: revisionNumber}
    }).sort('revision').exec().then((dbOperations) => {
        return dbOperations.map((dbOperation) => {
            return TextOperation.fromJSON(JSON.parse(dbOperation.operations));
        });
    });
};

/**
 * Creates and stores new Operation.
 *
 * @param {ObjectId|String|Document} document
 * @param {User} author
 * @param {Number} revision
 * @param {TextOperation} operation
 * @return {Promise<Operation>}
 */
const saveOperation = (document, author, revision, operation) => {
    return new Operation({
        revision: revision,
        operations: JSON.stringify(operation.toJSON()),
        author: author,
        document: document,
    }).save();
};

module.exports = {
    getLastOperationsByDocument: getLastOperationsByDocument,
    getOperationsAfterRevisionByDocument: getOperationsAfterRevisionByDocument,
    saveOperation: saveOperation
};
