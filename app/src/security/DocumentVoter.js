const Promise = require('promise');
const Errors = require('../utils/Errors');
const DocumentRepository = require('../repositories/DocumentRepository');


class DocumentVoter {

    static get OperationTypes() {
        return [
            "none", "view", "chat", "write", "share", "remove"
        ];
    }

    /**
     *
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
     *
     *
     * @param {User} user
     * @param {Document} document
     *
     * @returns {Promise<array>}
     */
    static getAllowedOperations(user, document) {
        return new Promise((resolve) => {
            let level = 0;
            // owner can do everything or use default public link rights
            if(document.owner.equals(user._id)) {
                level = 5;
            } else {
                level = document.shareLinkRights;
            }
            // if we already have level 4 and more, we cannot get any higher and stop
            if(level >= 4) {
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