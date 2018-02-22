import React from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';

// TODO: rewrite
import SocketIOAdapter from '../../../OperationalTransformation/SocketIOAdapter';
import CodeMirrorAdapter from '../../../OperationalTransformation/CodeMirrorAdapter';
import EditorClient from '../../../OperationalTransformation/EditorClient';

import {UnControlled as CodeMirror} from 'react-codemirror2';

import DocumentStore from "../../../Stores/DocumentStore";
import Loading from "../../Components/Loading";

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

    constructor() {
        super();

        this.state = {
            lastSendValue: '',

            settings: {
                mode: 'null',
                theme: 'default',
                readOnly: true,
            }
        };

        this.handleSettingsChange = this.handleSettingsChange.bind(this);
    }

    componentDidMount() {
        DocumentStore.on('settings', this.handleSettingsChange);
        DocumentStore.last('settings', this.handleSettingsChange);

        this.socket = io({
            path: '/api/socket.io',
            query: 'documentId='+this.props.documentId
        });

        this.socket.on('connect', () => {
            this.socket.emit('joinRoom', { room: this.props.documentId, username: 'username' });
        });

        this.socket.on('doc', (obj) => {
            this.init(obj.document, obj.revision, obj.clients, this.cmClient ? this.cmClient.serverAdapter : new SocketIOAdapter(this.socket));
        });

        this.socket.on('disconnect', () => DocumentStore.emit('disconnect'));

        this.socket.on('settings', (settings) => {
            console.log('Settings:' + settings);
            DocumentStore.emitAndSave('settings', settings)
        });
    }

    init(str, revision, clients, serverAdapter) {
        if(this.cmClient) {
            this.cmClient.editorAdapter.detach();
        }
        this.editor.setValue(str);
        this.cmClient = new EditorClient(
            revision, clients, serverAdapter, new CodeMirrorAdapter(this.editor)
        );
    }

    componentWillUnmount() {
        DocumentStore.off('settings', this.handleSettingsChange);
        this.socket.close();
    }

    handleSettingsChange(settings) {
        if(!settings) return;
        this.setState({
           settings: settings
        });
    }

    render() {
        return (
            <div className={'Comp-Editor'} style={{fontSize: 14}}>
                <CodeMirror
                    className={'codemirror-editor'}
                    options={{
                        mode: this.state.settings.mode,
                        theme: this.state.settings.theme,
                        tabSize: 4,
                        indentUnit: 4,
                        indentWithTabs: true,

                        keyMap: 'sublime',
                        styleActiveLine: true,
                        lineWrapping: true,
                        lineNumbers: true,

                        autofocus: true,
                        readOnly: this.state.settings.readOnly,
                    }}
                    editorDidMount={(editor) => {
                        console.log('mount');
                        this.editor = editor;
                        editor.focus();
                    }}
                    onChange={(editor, data, value) => {

                    }}
                />
                {/*<AceEditor
                    name="brace-editor"
                    mode={this.state.settings.mode}
                    theme={this.state.settings.theme}
                    readOnly={this.state.settings.readOnly}
                    onChange={(value) => {
                        this.setState({
                            value: value
                        });
                    }}
                    value={this.state.value}
                    editorProps={{$blockScrolling: true}}
                    //height={'calc(100vh - 2 * 30px)'}
                    width={'100%'}
                />*/}
            </div>
        );
    }
}

Editor.propTypes = {
    documentId: PropTypes.string.isRequired
};

export default Editor;
