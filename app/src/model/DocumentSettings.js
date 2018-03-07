const Modes = require('../../client/src/Utils/EditorModes');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentSettingsSchema = new Schema({
    theme: {type: String, required: true, default: 'material'},
    mode: {type: Number, min: 0, max: Modes.all.length - 1, default: 0},
    tabSize: {type: Number, min: 2, max: 8, required: true, default: 4},
    indentUnit: {type: Number, min: 2, max: 8, required: true, default: 4},
    indentWithTabs: {type: Boolean, required: true, default: true},
    fontSize: {type: Number, min: 6, max: 72, required: true, default: 14},
    keyMap: {type: String, enum: ['default', 'emacs', 'sublime', 'vim'], required: true, default: 'default'},
    styleActiveLine: {type: String, enum: ['true', 'false', 'nonEmpty'], required: true, default: 'nonEmpty'},
    lineWrapping: {type: Boolean, required: true, default: true},
    lineNumbers: {type: Boolean, required: true, default: true},
});

documentSettingsSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.__v;
    delete obj._id;
    return obj;
};

module.exports = mongoose.model('DocumentSettings', documentSettingsSchema);
