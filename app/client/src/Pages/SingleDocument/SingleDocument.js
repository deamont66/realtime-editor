import React from 'react';
import {Redirect} from 'react-router-dom';

import withStyles from 'material-ui/styles/withStyles';

import {LinearProgress} from 'material-ui/Progress';

import Editor from "./Editor/Editor";
import RightMenus from "./RightMenus/RightMenus";
import DocumentHeader from "./DocumentHeader/DocumentHeader";
import Error404 from "../Errors/Error404";

import ClientSocket from "./ClientSocket";

const styles = theme => ({
    root: {
        [theme.breakpoints.up('md')]: {
            margin: -theme.spacing.unit * 3,
        }
    }
});

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
                mode: 0,
                tabSize: 4,
                indentUnit: 4,
                indentWithTabs: true,
                fontSize: 14,
                keyMap: 'default',
                styleActiveLine: 'nonEmpty',
                lineWrapping: true,
                lineNumbers: true,
            },
            allowedOperations: [],
            messages: [],
        };

        this.documentId = this.props.match.params.documentId;
    }

    componentDidMount() {
        this.clientSocket = new ClientSocket(this.documentId, this.handleStateChange);
        this.clientSocket.connect();
    }

    componentWillUnmount() {
        this.clientSocket.close();
    }

    handleStateChange = (newState, callback) => {
        this.setState(newState, callback);
    };


    render() {
        const {classes} = this.props;

        if (!this.state.connected) {
            return <LinearProgress/>;
        }

        if (this.state.error !== null) {
            if (this.state.error === 401) {
                return <Redirect to={'/sign-in'}/>;
            }
            return <Error404/>;
        }

        return (
            <div className={classes.root}>
                <DocumentHeader disconnected={this.state.disconnected} clientState={this.state.clientState}
                                title={this.state.settings.title} allowedOperations={this.state.allowedOperations}
                                onSettingsChange={this.clientSocket.handleSettingsChange}
                                clients={this.state.clients}
                />
                <div className="editor-body">
                    <Editor settings={this.state.settings}
                            visible={this.state.connected !== false}
                            onEditorDidMount={this.clientSocket.setEditor}
                            readOnly={!this.state.allowedOperations.includes('write')}
                    />

                    {this.state.connected &&
                    <RightMenus documentId={this.documentId}
                                settings={this.state.settings}
                                messages={this.state.messages}
                                onSettingsChange={this.clientSocket.handleSettingsChange}
                                onMessageSubmit={this.clientSocket.handleMessageSubmit}
                    />}
                </div>
            </div>
        );
    }
}

SingleDocument.propTypes = {};

export default withStyles(styles)(SingleDocument);
