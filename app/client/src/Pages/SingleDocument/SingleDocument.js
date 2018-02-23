import React from 'react';
import Editor from "./Editor/Editor";
import RightMenus from "./RightMenus/RightMenus";
import DocumentTitle from "./DocumentTitle";

import './SingleDocument.css';
import Loading from "../Components/Loading";
import DocumentError from "./DocumentError";
import EditorClient from "../../OperationalTransformation/EditorClient";
import CodeMirrorAdapter from "../../OperationalTransformation/CodeMirrorAdapter";
import io from "socket.io-client";
import SocketIOAdapter from "../../OperationalTransformation/SocketIOAdapter";

class SingleDocument extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            connected: false,
            disconnected: false,
            error: null,

            settings: {
                title: '',
                theme: 'material',
                mode: 'javascript',
                tabSize: 4,
                indentUnit: 4,
                indentWithTabs: true,
                fontSize: 14,
                keyMap: 'emacs',
                styleActiveLine: 'nonEmpty',
                lineWrapping: true,
                lineNumbers: true,
            },
        };

        this.documentId = this.props.match.params.documentId;
    }

    componentDidMount() {
        console.log(this.documentId);
        this.socket = io('/documents', {
            path: '/api/socket.io',
            query: 'documentId=' + this.documentId
        });

        this.socket.on('connect', () => {
            this.setState({
                connected: true,
                disconnected: false
            });

            this.socket.emit('join', (obj) => {
                console.log(obj);
                this.init(obj.value, obj.revision, obj.clients, this.cmClient ? this.cmClient.serverAdapter : new SocketIOAdapter(this.socket));
                this.onSettings(obj.settings);
            });
        });

        this.socket.on('disconnect', () => {
            this.setState({
                disconnected: true
            })
        });

        this.socket.on('settings', (settings) => {
            this.onSettings(settings);
        });
    }

    componentWillUnmount() {
        this.socket.close();
    }

    handleEditorMount(editor) {
        this.editor = editor;
    }

    init(str, revision, clients, serverAdapter) {
        if (this.cmClient) {
            this.cmClient.editorAdapter.detach();
        }
        this.editor.setValue(str);
        this.cmClient = new EditorClient(
            revision, clients, serverAdapter, new CodeMirrorAdapter(this.editor)
        );
    }

    onSettings(settings) {
        console.log('Settings:', settings);
        this.setState({
            settings: settings
        })
    }

    handleSettingsChange(settings) {
        this.socket.emit('settings', Object.assign({}, this.state.settings, settings));
    }

    render() {
        if (!this.state.connected)
            return <Loading fullScreen={false}/>;

        if (this.state.error !== null)
            return <DocumentError error={this.state.error}/>;

        return (
            <div className="Comp-SingleDocument">
                <div className="editor-header">
                    {this.state.connected &&
                    <DocumentTitle title={this.state.settings.title}
                                   onSettingsChange={this.handleSettingsChange.bind(this)}/>}

                    {this.state.disconnected &&
                    <span className="warning text-warning" title="No connection">
                        <i className="fas fa-exclamation-triangle"/>
                        <span className="sr-only">No connection</span>
                    </span>}
                </div>
                <div className="editor-body">
                    <Editor settings={this.state.settings}
                            visible={this.state.connected !== null}
                            onEditorDidMount={this.handleEditorMount.bind(this)}/>

                    {this.state.connected &&
                    <RightMenus documentId={this.documentId}
                                settings={this.state.settings}
                                onSettingsChange={this.handleSettingsChange.bind(this)}/>}
                </div>
            </div>
        );
    }
}

SingleDocument.propTypes = {};

export default SingleDocument;
