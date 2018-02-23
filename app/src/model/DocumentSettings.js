const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentSettings = new Schema({
    theme: {type: String, required: true, default: 'material'},
    mode: {type: String, required: true, default: 'javascript'},
    tabSize: {type: Number, min: 2, max: 8, required: true, default: 4},
    indentUnit: {type: Number, min: 2, max: 8, required: true, default: 4},
    indentWithTabs: {type: Boolean, required: true, default: true},
    fontSize: {type: Number, min: 6, max: 72, required: true, default: 14},
    keyMap: {type: String, enum: ['emacs', 'ace', 'vim'], required: true, default: 'emacs'},
    styleActiveLine: {type: String, enum: ['true', 'false', 'nonEmpty'], required: true, default: 'nonEmpty'},
    lineWrapping: {type: Boolean, required: true, default: true},
    lineNumbers: {type: Boolean, required: true, default: true},
});

documentSettings.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.__v;
    delete obj._id;
    return obj;
};

const DocumentSettings = mongoose.model('DocumentSettings', documentSettings);
module.exports = DocumentSettings;
