
const Operation = require('../model/Operation');

const WrappedOperation = require('../../client/src/OperationalTransformation/WrappedOperation');
const TextOperation = require('ot').TextOperation;

const getLastOperationsByDocument = (documentId, last = 50) => {
    return Operation.find({
        document: documentId,
    }).sort('field -created').limit(last).exec().then((dbOperations) => {
        return dbOperations.map((dbOperation) => {
           return new WrappedOperation(TextOperation.fromJSON(JSON.parse(dbOperation.operations)), null);
        });
    });
};

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
    saveOperation: saveOperation
};
