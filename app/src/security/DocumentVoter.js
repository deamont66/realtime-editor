const Errors = require('../utils/Errors');
const DocumentRepository = require('../repositories/DocumentRepository');


class DocumentVoter {

    static get OperationTypes() {
        return [
            "none", "view", "chat", "write", "share", "remove"
        ];
    }

    /**
     * @param {string} operationType
     * @param {User} user
     * @param {Document[]} documents
     *
     * @returns {Promise<Document[]>} filtered documents
     */
    static filter(operationType, user, documents) {
        return documents.reduce((accPromise, document) => {
            return accPromise.then(filteredDocuments => {
                return DocumentVoter.getAllowedOperations(user, document).then((operations) => {
                    return operations.includes(operationType) ? [...filteredDocuments, document] : filteredDocuments;
                });
            });
        }, Promise.resolve([]));
    };

    /**
     * @param {string} operationType - Can be one of following: "view", "chat", "write", "share", "remove"
     * @param {User} user
     * @param {Document} document
     *
     * @returns {Promise}
     */
    static can(operationType, user, document) {
        return DocumentVoter.getAllowedOperations(user, document).then((operations) => {
            return operations.includes(operationType) ? Promise.resolve() : Promise.reject(Errors.insufficientPermission);
        });
    }

    /**
     * @param {User} user
     * @param {Document} document
     *
     * @returns {Promise<String[]>}
     */
    static getAllowedOperations(user, document) {
        return new Promise((resolve) => {
            let level = 0;
            const logged_in = (user && user.logged_in !== false);

            // owner can do everything or use default public link rights
            if(logged_in && document.owner.equals(user._id)) {
                level = 5;
            } else {
                level = document.shareLinkRights;
            }
            // if we already have level 4 and more, we cannot get any higher and stop
            if(!logged_in || level >= 4) {
                resolve(level);
                return;
            }
            // find highest document invite for user and return highest level
            DocumentRepository.getHighestDocumentInviteByUser(document, user).then((documentInvite) => {
                if(documentInvite && documentInvite.rights > level) {
                    level = documentInvite.rights;
                }
                resolve(level);
            });
        }).then((level) => {
            return DocumentVoter.OperationTypes.slice(0, level + 1)
        });
    }
}

module.exports = DocumentVoter;