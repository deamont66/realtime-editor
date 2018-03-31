import EventEmitter from 'event-emitter-es6';

/**
 * AbstractEditorAdapter for EditorClient
 * @class
 *
 * EventEmitter events:
 *  - undo              () - performed undo
 *  - redo              () - performed redo
 *  - blur              () - editor blur occurred
 *  - selectionChange   () - on editor selection change
 *  - change            (operation, selection) - on editor value and possible selection change
 *
 */
class AbstractEditorAdapter extends EventEmitter {

    constructor() {
        super();

        if (new.target === AbstractEditorAdapter) {
            throw new TypeError("Cannot construct AbstractEditorAdapter instances directly");
        }
    }

    /**
     * Sets other client selection to editor.
     */
    setOtherSelection() {
        throw new TypeError("Must override setOtherSelection method");
    }

    /**
     * @return {String} editor value
     */
    getValue() {
        throw new TypeError("Must override getValue method");
    }

    /**
     * @return {Selection} editor active selection
     */
    getSelection() {
        throw new TypeError("Must override getSelection method");
    }

    /**
     * Applies text operation to editor.
     * @param {TextOperation} operation
     */
    applyOperation(operation) {
        throw new TypeError("Must override applyOperation method");
    }

    /**
     * Sets editor selection
     * @param {Selection} selection
     */
    setSelection(selection) {
        throw new TypeError("Must override setSelection method");
    }

}

export default AbstractEditorAdapter;
