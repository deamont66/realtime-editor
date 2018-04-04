import React from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import moment from 'moment';
import withStyles from 'material-ui/styles/withStyles';

import Grid from 'material-ui/Grid';

import Editor from './Editor';
import RightMenus from './RightMenus';
import DocumentHeader from './DocumentHeader';
import ClientSocket from './ClientSocket';

import Error404 from '../Errors/Error404';
import MetaTags from '../../Components/MetaTags';
import DocumentAPIHandler from '../../APIHandlers/DocumentAPIHandler';

const styles = theme => ({
    root: {
        [theme.breakpoints.up('md')]: {
            margin: -theme.spacing.unit * 3,
        }
    },
    editorBody: {
        borderTop: `1px solid ${theme.palette.grey[300]}`,
    }
});

class SingleDocument extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            connected: false,
            disconnected: false,
            clientState: null,
            clients: [],
            error: null,

            settings: {
                title: '',
                theme: 'default',
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
            menu: null,
        };

        this.documentId = this.props.match.params.documentId;
        this.clientSocket = new ClientSocket(this.documentId);

        this.clientSocket.on('connect', this.handleConnect);
        this.clientSocket.on('disconnect', this.handleFieldChange('disconnect').bind(this, false));
        this.clientSocket.on('error', this.handleFieldChange('error'));
        this.clientSocket.on('state', this.handleFieldChange('clientState'));
        this.clientSocket.on('clients', this.handleFieldChange('clients'));
        this.clientSocket.on('settings', this.handleFieldChange('settings'));
        this.clientSocket.on('message', this.handleMessage);
    }

    componentWillUnmount() {
        this.clientSocket.close();
    }

    componentWillReceiveProps(nextProps) {
        if ((nextProps.user === null && this.props.user !== null) || (this.props.user && nextProps.user && this.props.user.username !== nextProps.user.username)) {
            this.clientSocket.connect();
        }
    }

    handleFieldChange = field => newData => {
        this.setState({
            [field]: newData
        });
    };

    handleConnect = (joinObject) => {
        this.setState({
            connected: true,
            disconnected: false,
            messages: [],
            settings: joinObject.settings,
            allowedOperations: joinObject.operations
        }, () => {
            joinObject.messages.forEach((message) => this.clientSocket.onChatMessage(message));
        });
    };

    handleMenuChange = (menu) => {
        this.setState((oldState) => {
            return {
                menu: (oldState.menu === menu) ? null : menu
            }
        });
    };

    handleSettingsChange = (settings) => {
        this.clientSocket.sendSettings(Object.assign({}, this.state.settings, settings));
    };

    handleMessage = (messageObj) => {
        this.setState((oldState) => {
            return {
                messages: [...oldState.messages, messageObj]
            };
        });
    };

    handleLoadMoreChatMessage = (emptyCallback) => {
        const lastDate = this.state.messages.reduce((acc, message) => {
            const messageDate = moment(message.date);
            return acc.isBefore(messageDate) ? acc : messageDate;
        }, moment());

        DocumentAPIHandler.fetchDocumentMessages(this.documentId, lastDate.toDate()).then((res) => {
            const newMessages = res.data.messages;
            if (newMessages.length === 0) {
                emptyCallback()
            } else {
                newMessages.forEach((message) => this.clientSocket.onChatMessage(message));
            }
        }).catch(() => {
            console.error('error');
            emptyCallback();
        });
    };

    render() {
        const {classes} = this.props;

        if (this.state.error !== null) {
            if (this.state.error === 401) {
                return <Redirect to={'/sign-in'}/>;
            }
            return <Error404/>;
        }

        return (
            <div className={classes.root}>
                <MetaTags title={this.state.settings.title}/>
                <DocumentHeader disconnected={this.state.disconnected} clientState={this.state.clientState}
                                title={this.state.settings.title} allowedOperations={this.state.allowedOperations}
                                onSettingsChange={this.handleSettingsChange}
                                toggleMenu={this.handleMenuChange}
                                clients={this.state.clients}
                />

                <Grid spacing={0} container wrap="wrap-reverse" className={classes.editorBody}>
                    <Editor settings={this.state.settings}
                            visible={this.state.connected !== false}
                            onEditorDidMount={(editor) => {
                                this.clientSocket.setEditor(editor);
                                this.clientSocket.connect();
                            }}
                            readOnly={!this.state.allowedOperations.includes('write')}
                    />

                    {this.state.connected &&
                    <RightMenus documentId={this.documentId}
                                user={this.props.user}
                                settings={this.state.settings}
                                messages={this.state.messages}
                                allowedOperations={this.state.allowedOperations}
                                menu={this.state.menu}
                                toggleMenu={this.handleMenuChange}
                                onSettingsChange={this.handleSettingsChange}
                                onMessageSubmit={this.clientSocket.sendMessage}
                                onLoadMoreChatMessage={this.handleLoadMoreChatMessage}
                    />}
                </Grid>
            </div>
        );
    }
}

SingleDocument.propTypes = {
    user: PropTypes.object,
};

export default withStyles(styles)(SingleDocument);
