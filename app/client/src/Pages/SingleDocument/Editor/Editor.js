import React from 'react';
import PropTypes from 'prop-types';

import {UnControlled as ReactCodeMirror} from 'react-codemirror2';

import Grid from 'material-ui/Grid';

import EditorModes from '../../../Utils/EditorModes';
import EditorThemes from '../../../Utils/EditorThemes';

import './Editor.css';

import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/selection/active-line';

const loadKeymaps = () => {
    return new Promise(resolve => {
        require.ensure([], () => {
            require('codemirror/keymap/emacs');
            require('codemirror/keymap/sublime');
            require('codemirror/keymap/vim');
            resolve();
        });
    });
};

class Editor extends React.Component {

    constructor() {
        super();

        this.state = {
            loaded: false
        }
    }

    componentDidMount() {
        Promise.all([
            EditorModes.require(),
            EditorThemes.require(),
            loadKeymaps()
        ]).then(() => {
            // After all loaded, force codeMirror to reload mode and forceUpdate component
            this.setState({
                loaded: true
            });
        })
    }

    componentDidUpdate() {
        // Renders all dynamically generated parts of CodeMirror editor.
        this.editor.refresh();
    }

    render() {
        return (
            <Grid item xs={12} sm className={'Comp-Editor'} style={{
                fontSize: this.props.settings.fontSize,
                display: (this.props.visible) ? 'block' : 'none'
            }}>
                <ReactCodeMirror
                    className={'codemirror-editor'}
                    options={{
                        mode: this.state.loaded ? EditorModes.all[this.props.settings.mode].mode : 'null',
                        theme: this.state.loaded ? this.props.settings.theme : 'default',
                        tabSize: this.props.settings.tabSize,
                        indentUnit: this.props.settings.indentUnit,
                        indentWithTabs: this.props.settings.indentWithTabs,

                        keyMap: this.state.loaded ? this.props.settings.keyMap : 'default',
                        styleActiveLine: this.props.settings.styleActiveLine === 'nonEmpty'
                            ? {nonEmpty: true} : (this.props.settings.styleActiveLine === 'true'),
                        lineWrapping: this.props.settings.lineWrapping,
                        lineNumbers: this.props.settings.lineNumbers,

                        readOnly: this.props.readOnly,
                    }}
                    editorDidMount={(editor) => {
                        this.props.onEditorDidMount(editor);
                        this.editor = editor;
                        editor.focus();
                    }}
                    onChange={(editor, data, value) => {
                        // this handler is required by react-codemirror2 plugin
                    }}
                />
            </Grid>
        );
    }
}

Editor.propTypes = {
    onEditorDidMount: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired,
    readOnly: PropTypes.bool.isRequired,
};

Editor.defaultProps = {
    visible: true,
};

export default Editor;
