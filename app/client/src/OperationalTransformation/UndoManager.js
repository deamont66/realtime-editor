/**
 * Most of this code is taken from OT.js library:
 * https://github.com/Operational-Transformation/ot.js/
 *
 * Only minor functional changes were made (mostly rewritten to ES6).
 */

const NORMAL_STATE = 'normal';
const UNDOING_STATE = 'undoing';
const REDOING_STATE = 'redoing';

/**
 * Transforms given stack according to new operation.
 *
 * @param {Operation[]|[]} stack
 * @param {Operation|*} operation
 * @returns {Operation[]|[]} transformedStack
 */
const transformStack = (stack, operation) => {
    const newStack = [];
    const Operation = operation.constructor;
    for (let i = stack.length - 1; i >= 0; i--) {
        const pair = Operation.transform(stack[i], operation);
        if (typeof pair[0].isNoop !== 'function' || !pair[0].isNoop()) {
            newStack.push(pair[0]);
        }
        operation = pair[1];
    }
    return newStack.reverse();
};

class UndoManager {

    /**
     * Create a new UndoManager with an optional maximum history size.
     *
     * @param {Number} maxItems
     */
    constructor(maxItems = 50) {
        this.maxItems = maxItems;
        this.state = NORMAL_STATE;
        this.dontCompose = false;
        this.undoStack = [];
        this.redoStack = [];
    }

    /**
     * Adds operation to stack depending on state.
     *
     * @param {Operation|*} operation
     * @param {Boolean} compose
     */
    add(operation, compose = false) {
        switch(this.state) {
            case UNDOING_STATE: {
                this.redoStack.push(operation);
                this.dontCompose = true;
                break;
            }
            case REDOING_STATE: {
                this.undoStack.push(operation);
                this.dontCompose = true;
                break;
            }
            // NORMAL_STATE
            default: {
                if (!this.dontCompose && compose && this.undoStack.length > 0) {
                    this.undoStack.push(operation.compose(this.undoStack.pop()));
                } else {
                    this.undoStack.push(operation);
                    if (this.undoStack.length > this.maxItems) {
                        this.undoStack.shift();
                    }
                }
                this.dontCompose = false;
                this.redoStack = [];
            }
        }
    }

    /**
     * Transforms both stack based on passed operation.
     *
     * @param {Operation|*} operation
     */
    transform(operation) {
        this.undoStack = transformStack(this.undoStack, operation);
        this.redoStack = transformStack(this.redoStack, operation);
    }

    /**
     * Performs single undo. Calls callback with undo operation.
     *
     * @param {function} callback
     */
    performUndo(callback) {
        this.state = UNDOING_STATE;
        if (this.undoStack.length === 0) {
            throw new Error("undo not possible");
        }
        callback(this.undoStack.pop());
        this.state = NORMAL_STATE;
    }

    /**
     * Performs single redo (inverse to performUndo). Calls callback with redo operation.
     *
     * @param {function} callback
     */
    performRedo(callback) {
        this.state = REDOING_STATE;
        if (this.redoStack.length === 0) {
            throw new Error("redo not possible");
        }
        callback(this.redoStack.pop());
        this.state = NORMAL_STATE;
    }

    /**
     * Decides whenever is undo available (based on undoStack size).
     *
     * @returns {boolean} is undo available
     */
    canUndo() {
        return this.undoStack.length !== 0;
    };

    /**
     * Decides whenever is redo available (based on redoStack size).
     *
     * @returns {boolean} is redo available
     */
    canRedo() {
        return this.redoStack.length !== 0;
    };

    /**
     * Checks state of this UndoManager instance.
     * @returns {boolean} is undoing operation in process
     */
    isUndoing() {
        return this.state === UNDOING_STATE;
    };

    /**
     * Checks state of this UndoManager instance.
     * @returns {boolean} is redoing operation in process
     */
    isRedoing() {
        return this.state === REDOING_STATE;
    };
}

export default UndoManager;
