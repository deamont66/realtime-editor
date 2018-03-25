/**
 * Most of this code is taken from OT.js library:
 * https://github.com/Operational-Transformation/ot.js/
 *
 * Only minor functional changes were made (mostly rewritten to ES6).
 */

import {Client, Selection, TextOperation} from 'ot';
import WrappedOperation from './WrappedOperation';
import UndoManager from './UndoManager';
import createColor from '../Utils/ColorGenerator';
import EventEmitter from 'event-emitter-es6';

class SelfMeta {
    constructor(selectionBefore, selectionAfter) {
        this.selectionBefore = selectionBefore;
        this.selectionAfter = selectionAfter;
    }

    invert() {
        return new SelfMeta(this.selectionAfter, this.selectionBefore);
    }

    compose(other) {
        return new SelfMeta(this.selectionBefore, other.selectionAfter);
    }

    transform(operation) {
        return new SelfMeta(
            this.selectionBefore.transform(operation),
            this.selectionAfter.transform(operation)
        );
    }
}

/*class OtherMeta {
    constructor(clientId, selection) {
        this.clientId = clientId;
        this.selection = selection;
    }

    static fromJSON(obj) {
        return new OtherMeta(
            obj.clientId,
            obj.selection && Selection.fromJSON(obj.selection)
        );
    }

    transform(operation) {
        return new OtherMeta(
            this.clientId,
            this.selection && this.selection.transform(operation)
        );
    }
}*/

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

    constructor(revision, clients, serverAdapter, editorAdapter) {
        super(revision);
        this.serverAdapter = serverAdapter;
        this.editorAdapter = editorAdapter;
        this.undoManager = new UndoManager();

        this.emitter = new EventEmitter();

        this.initializeClients(clients);

        this.editorAdapter.registerCallbacks({
            change: (operation, inverse) => {
                this.onChange(operation, inverse);
            },
            selectionChange: () => {
                this.onSelectionChange();
            },
            blur: () => {
                this.onBlur();
            }
        });
        this.editorAdapter.registerUndo(() => {
            this.undo();
        });
        this.editorAdapter.registerRedo(() => {
            this.redo();
        });

        this.serverAdapter.registerCallbacks({
            client_left: (clientId) => {
                this.onClientLeft(clientId);
                this.emitter.emit('clientsChanged', this.clients);
            },
            set_name: (clientId, name) => {
                this.getClientObject(clientId).setName(name);
                this.emitter.emit('clientsChanged', this.clients);
            },
            ack: () => {
                this.serverAck();
            },
            operation: (operation) => {
                this.applyServer(TextOperation.fromJSON(operation));
            },
            selection: (clientId, selection) => {
                if (selection) {
                    this.getClientObject(clientId).updateSelection(
                        this.transformSelection(Selection.fromJSON(selection))
                    );
                } else {
                    this.getClientObject(clientId).removeSelection();
                }
            },
            clients: (clients) => {
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
            },
            reconnect: () => {
                this.serverReconnect();
            }
        });
    }

    setState(state) {
        super.setState(state);

        // This needs to be done because classes are renamed by webpack during build process.
        let stateName = 'AwaitingWithBuffer';
        if (state instanceof Client.Synchronized) {
            stateName = 'Synchronized';
        } else if (state instanceof Client.AwaitingConfirm) {
            stateName = 'AwaitingConfirm';
        }

        this.emitter.emit('stateChange', stateName);
    }

    addClient(clientId, clientObj) {
        this.clients[clientId] = new OtherClient(
            clientId,
            this.editorAdapter,
            clientObj.name,
            clientObj.selection ? Selection.fromJSON(clientObj.selection) : null
        );
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
        // console.log("User disconnected: " + clientId);
        const client = this.clients[clientId];
        if (!client) {
            return;
        }
        client.remove();
        delete this.clients[clientId];
    }

    applyUnredo(operation) {
        this.undoManager.add(operation.invert(this.editorAdapter.getValue()));
        this.editorAdapter.applyOperation(operation.wrapped);
        this.selection = operation.meta.selectionAfter;
        this.editorAdapter.setSelection(this.selection);
        this.applyClient(operation.wrapped);
    }

    undo() {
        const self = this;
        if (!this.undoManager.canUndo()) {
            return;
        }
        this.undoManager.performUndo(function (o) {
            self.applyUnredo(o);
        });
    }

    redo() {
        const self = this;
        if (!this.undoManager.canRedo()) {
            return;
        }
        this.undoManager.performRedo(function (o) {
            self.applyUnredo(o);
        });
    }

    onChange(textOperation, inverse) {
        const selectionBefore = this.selection;
        this.updateSelection();
        // const meta = new SelfMeta(selectionBefore, this.selection);
        // const operation = new WrappedOperation(textOperation, meta);

        const compose = this.undoManager.undoStack.length > 0 &&
            inverse.shouldBeComposedWithInverted(this.undoManager.undoStack[this.undoManager.undoStack.length - 1].wrapped);
        const inverseMeta = new SelfMeta(this.selection, selectionBefore);
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

    sendOperation(revision, operation) {
        this.serverAdapter.sendOperation(revision, operation.toJSON(), this.selection);
    }

    applyOperation(operation) {
        // console.log(operation);
        this.editorAdapter.applyOperation(operation);
        this.updateSelection();
        this.undoManager.transform(new WrappedOperation(operation, null));
    }
}


export default EditorClient;
