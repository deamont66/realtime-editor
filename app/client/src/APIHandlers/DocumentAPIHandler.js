import axios from '../Utils/Axios';

class DocumentAPIHandler {

    static fetchMyDocuments() {
        return axios.get('/document');
    }

    static fetchSharedDocuments() {
        return axios.get('/document/shared');
    }

    static fetchLastDocuments() {
        return axios.get('/document/last');
    }

    static fetchCreateDocument() {
        return axios.post('/document/');
    }

    static fetchRemoveDocument(documentId) {
        return axios.delete(`/document/${documentId}`);
    }

    static fetchDocumentMessages(documentId, lastDate = new Date()) {
        return axios.get(`/document/${documentId}/messages`, {
            params: {
                lastDate
            }
        });
    }

    static fetchDocumentRights(documentId) {
        return axios.get(`/document/${documentId}/rights`);
    }

    static fetchUpdateDocumentLinkRights(documentId, shareLinkRights) {
        return axios.put(`/document/${documentId}/rights`, {
            shareLinkRights
        });
    }

    static fetchUpdateDocumentInvite(documentId, username, rights) {
        return axios.put(`/document/${documentId}/rights/invite`, {
            rights,
            to: username
        });
    }

    static fetchRemoveDocumentInvite(documentId, userId) {
        return axios.delete(`/document/${documentId}/rights/${userId}`);
    }

}

export default DocumentAPIHandler;
