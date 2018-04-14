/**
 * Most of this code is taken from OT.js library:
 * https://github.com/Operational-Transformation/ot.js/
 *
 * Only minor functional changes were made (mostly rewritten to ES6).
 * Cooperation with adapters and usage of EventEmitter designed and implemented by Jiří Šimeček.
 */

import {Client, Selection, TextOperation} from 'ot';
import EventEmitter from 'event-emitter-es6';

import WrappedOperation from './WrappedOperation';
import UndoManager from './UndoManager';
import createColor from '../Utils/ColorGenerator';
import AbstractServerAdapter from './AbstractServerAdapter';
import AbstractEditorAdapter from './AbstractEditorAdapter';

class SelfSelection {
    constructor(selectionBefore, selectionAfter) {
        this.selectionBefore = selectionBefore;
        this.selectionAfter = selectionAfter;
    }

    invert() {
        return new SelfSelection(this.selectionAfter, this.selectionBefore);
    }

    compose(other) {
        return new SelfSelection(this.selectionBefore, other.selectionAfter);
    }

    transform(operation) {
        return new SelfSelection(
            this.selectionBefore.transform(operation),
            this.selectionAfter.transform(operation)
        );
    }
}

class OtherClient {
    constructor(id, editorAdapter, name, selection) {
        this.id = id;
        this.editorAdapter = editorAdapter;
        this.name = name;

        this.setColor(name);
        if (selection) {
            this.updateSelection(selection);
        }
    }

    setColor(name) {
        const color = createColor(name);
        this.color = color.dark;
        this.lightColor = color.light;
    }

    setName(name) {
        if (this.name === name) {
            return;
        }
        this.name = name;
        this.setColor(name);
    }

    updateSelection(selection) {
        this.removeSelection();
        this.selection = selection;
        this.mark = this.editorAdapter.setOtherSelection(
            selection,
            selection.position === selection.selectionEnd ? this.color : this.lightColor,
            this.name || 'Anonymous'
        );
    }

    remove() {
        this.removeSelection();
    }

    removeSelection() {
        if (this.mark) {
            this.mark.clear();
            this.mark = null;
        }
    }
}

class EditorClient extends Client {

    /**
     * @param {Number} revision
     * @param {Object} clients
     * @param {AbstractServerAdapter} serverAdapter
     * @param {AbstractEditorAdapter} editorAdapter
     */
    constructor(revision, clients, serverAdapter, editorAdapter) {
        super(revision);

        if(!serverAdapter instanceof AbstractServerAdapter) {
            throw new TypeError(`Invalid serverAdapter parameter type (${typeof serverAdapter}) expected instanceof AbstractServerAdapter`);
        }

        if(!editorAdapter instanceof AbstractEditorAdapter) {
            throw new TypeError(`Invalid editorAdapter parameter type (${typeof editorAdapter}) expected instanceof AbstractEditorAdapter`);
        }

        this.serverAdapter = serverAdapter;
        this.editorAdapter = editorAdapter;
        this.undoManager = new UndoManager();

        this.emitter = new EventEmitter();

        this.initializeClients(clients);

        this.onChange = this.onChange.bind(this);
        this.onSelectionChange = this.onSelectionChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.undo = this.undo.bind(this);
        this.redo = this.redo.bind(this);

        this.editorAdapter.on('change', this.onChange);
        this.editorAdapter.on('selectionChange', this.onSelectionChange);
        this.editorAdapter.on('blur', this.onBlur);
        this.editorAdapter.on('undo', this.undo);
        this.editorAdapter.on('redo', this.redo);


        this.onClientLeft = this.onClientLeft.bind(this);
        this.setClientName = this.setClientName.bind(this);
        this.serverAck = this.serverAck.bind(this);
        this.onReceivedOperation = this.onReceivedOperation.bind(this);
        this.onReceivedSelection = this.onReceivedSelection.bind(this);

        this.serverAdapter.on('client_left', this.onClientLeft);
        this.serverAdapter.on('set_name', this.setClientName);
        this.serverAdapter.on('ack', this.serverAck);
        this.serverAdapter.on('operation', this.onReceivedOperation);
        this.serverAdapter.on('selection', this.onReceivedSelection);
    }

    setState(state) {
        super.setState(state);
        this.emitter.emit('stateChange', state);
    }

    addClient(clientId, clientObj) {
        this.clients[clientId] = new OtherClient(
            clientId,
            this.editorAdapter,
            clientObj.name,
            clientObj.selection ? Selection.fromJSON(clientObj.selection) : null
        );
    }

    setClients(clients) {
        let clientId;
        for (clientId in this.clients) {
            if (this.clients.hasOwnProperty(clientId) && !clients.hasOwnProperty(clientId)) {
                this.onClientLeft(clientId);
            }
        }

        for (clientId in clients) {
            if (clients.hasOwnProperty(clientId)) {
                const clientObject = this.getClientObject(clientId);

                if (clients[clientId].name) {
                    clientObject.setName(clients[clientId].name);
                }

                const selection = clients[clientId].selection;
                if (selection) {
                    this.clients[clientId].updateSelection(
                        this.transformSelection(Selection.fromJSON(selection))
                    );
                } else {
                    this.clients[clientId].removeSelection();
                }
            }
        }
        this.emitter.emit('clientsChanged', this.clients);
    }

    setClientName(clientId, name) {
        this.getClientObject(clientId).setName(name);
        this.emitter.emit('clientsChanged', this.clients);
    }

    initializeClients(clients) {
        this.clients = {};
        for (let clientId in clients) {
            if (clients.hasOwnProperty(clientId)) {
                this.addClient(clientId, clients[clientId]);
            }
        }
        this.emitter.emit('clientsChanged', this.clients);
    }

    getClientObject(clientId) {
        const client = this.clients[clientId];
        if (client) {
            return client;
        }
        return this.clients[clientId] = new OtherClient(
            clientId,
            this.editorAdapter
        );
    }

    onClientLeft(clientId) {
        const client = this.clients[clientId];
        if (!client) {
            return;
        }
        client.remove();
        delete this.clients[clientId];
        this.emitter.emit('clientsChanged', this.clients);
    }

    onReceivedOperation(operation) {
        this.applyServer(TextOperation.fromJSON(operation));
    }

    onReceivedSelection(clientId, selection) {
        if (selection) {
            this.getClientObject(clientId).updateSelection(
                this.transformSelection(Selection.fromJSON(selection))
            );
        } else {
            this.getClientObject(clientId).removeSelection();
        }
    }

    applyUnredo(operation) {
        this.undoManager.add(operation.invert(this.editorAdapter.getValue()));
        this.editorAdapter.applyOperation(operation.wrapped);
        this.selection = operation.meta.selectionAfter;
        this.editorAdapter.setSelection(this.selection);
        this.applyClient(operation.wrapped);
    }

    undo() {
        if (!this.undoManager.canUndo()) {
            return;
        }
        this.undoManager.performUndo((o) => {
            this.applyUnredo(o);
        });
    }

    redo() {
        if (!this.undoManager.canRedo()) {
            return;
        }
        this.undoManager.performRedo((o) => {
            this.applyUnredo(o);
        });
    }

    onChange(textOperation, inverse) {
        const selectionBefore = this.selection;
        this.updateSelection();

        const compose = this.undoManager.undoStack.length > 0 &&
            inverse.shouldBeComposedWithInverted(this.undoManager.undoStack[this.undoManager.undoStack.length - 1].wrapped);
        const inverseMeta = new SelfSelection(this.selection, selectionBefore);
        this.undoManager.add(new WrappedOperation(inverse, inverseMeta), compose);
        this.applyClient(textOperation);
    }

    updateSelection() {
        this.selection = this.editorAdapter.getSelection();
    }

    onSelectionChange() {
        const oldSelection = this.selection;
        this.updateSelection();
        if (oldSelection && this.selection.equals(oldSelection)) {
            return;
        }
        this.sendSelection(this.selection);
    }

    onBlur() {
        this.selection = null;
        this.sendSelection(null);
    }

    sendSelection(selection) {
        if (this.state instanceof Client.AwaitingWithBuffer) {
            return;
        }
        this.serverAdapter.sendSelection(selection);
    }

    /**
     * Called by Client to send new operation to serverAdapter.
     * @param revision
     * @param operation
     */
    sendOperation(revision, operation) {
        this.serverAdapter.sendOperation(revision, operation.toJSON(), this.selection);
    }

    /**
     * Called by Client parent to apply operation to editorAdapter.
     * @param {TextOperation} operation
     */
    applyOperation(operation) {
        this.editorAdapter.applyOperation(operation);
        this.updateSelection();
        this.undoManager.transform(new WrappedOperation(operation, null));
    }
}


export default EditorClient;
