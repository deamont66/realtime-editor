const Operation = require('../model/Operation');

const {TextOperation} = require('operational-transformation-text');

const updateCacheAndGetCurrentContent = (document) => {
    return Promise.all([
        getOperationsAfterRevisionByDocument(document, document.cacheRevision),
        getLastRevisionByDocument(document)
    ]).then(([operations, revision]) => {
        if (operations.length) {
            //console.log(document.cacheRevision, operations, revision);
            const value = operations.reduce((value, op) => op.apply(value), document.cacheContent);
            document.cacheRevision = revision;
            document.cacheContent = value;
            return document.save();
        }
        return document;
    }).then((newDocument) => {
        return newDocument;
    });
};

const getLastRevisionByDocument = (documentId) => {
    return Operation.find({
        document: documentId,
    }).sort('-revision').limit(1).exec().then(([operation]) => {
        if (operation) {
            return operation.revision;
        }
        return 0;
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
    updateCacheAndGetCurrentContent: updateCacheAndGetCurrentContent,
    getLastRevisionByDocument: getLastRevisionByDocument,
    getOperationsAfterRevisionByDocument: getOperationsAfterRevisionByDocument,
    saveOperation: saveOperation
};
