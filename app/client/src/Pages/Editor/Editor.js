import React from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import openSocket from 'socket.io-client';

import 'brace/mode/javascript';
import 'brace/theme/monokai';

import './Editor.css';

class Editor extends React.Component {

    constructor() {
        super();

        this.state = {
            value: '',
            lastSendValue: ''
        }
    }

    componentDidMount() {
        this.socket = openSocket({
            path: '/api/socket.io'
        });
        this.socket.on('value', (value) => {
            this.setState({
                value: value
            });
        });
    }

    componentWillUnmount() {
        this.socket.close();
    }

    handleEditorChange(value) {
        this.setState({
            value: value
        });
        if(value !== this.state.lastSendValue) {
            console.log(value);
            this.setState({
                lastSendValue: value
            });
            this.socket.emit('value', value);
        }
    }

    render() {
        return (
            <div className="Comp-Editor">
                <AceEditor
                    name="brace-editor"
                    mode="javascript"
                    theme="monokai"
                    onChange={this.handleEditorChange.bind(this)}
                    value={this.state.value}
                    editorProps={{$blockScrolling: true}}
                    height={'calc(100vh - 56px - 25px)'} width={'100%'}
                />
                <div className="editor-footer">
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                Footer
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Editor.propTypes = {
    user: PropTypes.object.isRequired,
};

export default Editor;
