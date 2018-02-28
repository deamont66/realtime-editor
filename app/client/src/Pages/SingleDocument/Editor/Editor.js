import React from 'react';
import PropTypes from 'prop-types';

import {UnControlled as CodeMirror} from 'react-codemirror2';

import EditorModes from '../../../Utils/EditorModes';
import EditorThemes from '../../../Utils/EditorThemes';

import './Editor.css';

import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/selection/active-line';

import 'codemirror/keymap/emacs';
import 'codemirror/keymap/sublime';
import 'codemirror/keymap/vim';

EditorModes.require();
EditorThemes.require();

class Editor extends React.Component {

    render() {
        return (
            <div className={'Comp-Editor'} style={{fontSize: this.props.settings.fontSize, display: (this.props.visible) ? 'block' : 'none'}}>
                <CodeMirror
                    className={'codemirror-editor'}
                    options={{
                        mode: this.props.settings.mode,
                        theme: this.props.settings.theme,
                        tabSize: this.props.settings.tabSize,
                        indentUnit: this.props.settings.indentUnit,
                        indentWithTabs: this.props.settings.indentWithTabs,

                        keyMap: this.props.settings.keyMap,
                        styleActiveLine: this.props.settings.styleActiveLine,
                        lineWrapping: this.props.settings.lineWrapping,
                        lineNumbers: this.props.settings.lineNumbers,

                        readOnly: this.props.settings.readOnly,
                    }}
                    editorDidMount={(editor) => {
                        this.props.onEditorDidMount(editor);
                        editor.focus();
                    }}
                    onChange={(editor, data, value) => {
                        // this handler is required by plugin
                    }}
                />
            </div>
        );
    }
}

Editor.propTypes = {
    onEditorDidMount: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired,
};

Editor.defaultProps = {
    visible: true,
};

export default Editor;
