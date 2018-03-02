import React from 'react';
import io from "socket.io-client";

import Editor from "./Editor/Editor";
import DocumentError from "./DocumentError";
import RightMenus from "./RightMenus/RightMenus";
import DocumentHeader from "./DocumentHeader/DocumentHeader";

import Loading from "../Components/Loading";
import EditorClient from "../../OperationalTransformation/EditorClient";
import CodeMirrorAdapter from "../../OperationalTransformation/CodeMirrorAdapter";
import SocketIOAdapter from "../../OperationalTransformation/SocketIOAdapter";

import './SingleDocument.css';

class SingleDocument extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            connected: false,
            disconnected: false,
            clientState: 'Synchronized',
            clients: [],
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
                this.init(obj.value, obj.revision, obj.clients, this.editorClient ? this.editorClient.serverAdapter : new SocketIOAdapter(this.socket));
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
        if (this.editorClient) {
            this.editorClient.editorAdapter.detach();
        }
        this.editor.setValue(str);
        this.editorClient = new EditorClient(
            revision, clients, serverAdapter, new CodeMirrorAdapter(this.editor)
        );
        this.editorClient.emitter.on('stateChange', (state) => {
            this.setState({
                clientState: state
            });
        });
        this.editorClient.emitter.on('clientsChanged', (clients) => {
            this.setState({
                clients: Object.keys(clients).map((clientId) => {
                    return Object.assign({
                        id: clientId
                    }, clients[clientId]);
                })
            });
        });
    }

    onSettings(settings) {
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
                <DocumentHeader disconnected={this.state.disconnected} clientState={this.state.clientState}
                                title={this.state.settings.title}
                                onSettingsChange={this.handleSettingsChange.bind(this)}
                                clients={this.state.clients}
                />
                <div className="editor-body">
                    <Editor settings={this.state.settings}
                            visible={this.state.connected !== false}
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
