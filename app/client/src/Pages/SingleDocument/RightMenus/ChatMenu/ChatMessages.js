import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'material-ui/styles/withStyles';

import Grid from 'material-ui/Grid';

import MessageList from "./MessageList";
import SendMessageForm from "./SendMessageForm";

const styles = theme => ({
    root: {
        height: '100%',
        backgroundColor: theme.palette.background.default,
    }
});

class ChatMessages extends React.Component {

    render() {
        const {classes} = this.props;

        return (
            <Grid container direction={'column'} spacing={0} className={classes.root}>
                <MessageList user={this.props.user} messages={this.props.messages}
                             onLoadMoreChatMessage={this.props.onLoadMoreChatMessage}/>
                <SendMessageForm user={this.props.user} onMessageSubmit={this.props.onMessageSubmit}/>
            </Grid>
        );
    }
}

ChatMessages.propTypes = {
    user: PropTypes.object,
    messages: PropTypes.array.isRequired,
    onMessageSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onLoadMoreChatMessage: PropTypes.func.isRequired

};

export default withStyles(styles)(ChatMessages);
