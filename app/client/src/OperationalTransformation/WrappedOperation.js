/**
 * Most of this code is taken from OT.js library:
 * https://github.com/Operational-Transformation/ot.js/
 *
 * Only minor functional changes were made (mostly rewritten to ES6).
 */

/**
 * Tries to compose two metas to one.
 *
 * @param {Selection|*} a
 * @param {Selection|*} b
 * @returns {Selection|*} newMeta
 */
function composeMeta (a, b) {
    if (a && typeof a === 'object') {
        if (typeof a.compose === 'function') { return a.compose(b); }
        const meta = {};
        Object.assign(meta, a, b);
        return meta;
    }
    return b;
}

/**
 * Tries to transform meta based on operation.
 *
 * @param {Selection|*} meta
 * @param {Operation} operation
 * @returns {Selection|*} meta
 */
function transformMeta (meta, operation) {
    if (meta && typeof meta === 'object') {
        if (typeof meta.transform === 'function') {
            return meta.transform(operation);
        }
    }
    return meta;
}

/**
 * Wrapper around TextOperation and Selection from OT.js library.
 * Preserves TextOperation/Operation interface, simulating OOP Decorator pattern in JS.
 */
class WrappedOperation {

    /**
     * Creates new WrappedOperation around Operation and some meta object (Selection).
     *
     * @param {Operation} operation
     * @param {Selection} meta
     */
    constructor(operation, meta) {
        this.wrapped = operation;
        this.meta = meta;
    }

    /**
     * Calls apply function of wrapped Operation
     */
    apply() {
        return this.wrapped.apply.apply(this.wrapped, arguments);
    }

    /**
     * Returns inverted WrappedOperation of inverted wrapped Operation and meta.
     *
     * @returns {WrappedOperation} inverted WrappedOperation
     */
    invert() {
        const meta = this.meta;
        return new WrappedOperation(
            this.wrapped.invert.apply(this.wrapped, arguments),
            meta && typeof meta === 'object' && typeof meta.invert === 'function' ?
                meta.invert.apply(meta, arguments) : meta
        );
    }

    /**
     * Returns new composed WrappedOperation.
     *
     * @param {WrappedOperation} other
     * @returns {WrappedOperation}
     */
    compose(other) {
        return new WrappedOperation(
            this.wrapped.compose(other.wrapped),
            composeMeta(this.meta, other.meta)
        );
    }

    /**
     * Transforms WrappedOperation a based on WrappedOperation b.
     *
     * @param {WrappedOperation} a
     * @param {WrappedOperation} b
     * @returns {WrappedOperation[]}
     */
    static transform(a, b) {
        const transform = a.wrapped.constructor.transform;
        const pair = transform(a.wrapped, b.wrapped);
        return [
            new WrappedOperation(pair[0], transformMeta(a.meta, b.wrapped)),
            new WrappedOperation(pair[1], transformMeta(b.meta, a.wrapped))
        ];
    }
}

module.exports = WrappedOperation;