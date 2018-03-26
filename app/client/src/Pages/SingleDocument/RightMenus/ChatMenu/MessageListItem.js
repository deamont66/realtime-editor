import React from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import classNames from 'classnames';
import withStyles from 'material-ui/styles/withStyles';

import {ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import MessageListItemText from "./MessageListItemText";

const styles = theme => ({
    root: {
        paddingLeft: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit * 2
    },
    avatar: {
        color: theme.palette.common.white,
        alignSelf: 'flex-start'
    },
    myMessage: {
        backgroundColor: theme.palette.background.paper
    }
});

class MessageListItem extends React.Component {

    render() {
        const {message, classes, user, t} = this.props;
        const isMyMessage = user && user._id === message.user._id;

        return (
            <ListItem className={classNames(classes.root, {[classes.myMessage]: isMyMessage})}>
                <Avatar style={{backgroundColor: message.user.color.dark}} className={classes.avatar}>
                    {message.user.username.slice(0, 2).toLocaleUpperCase()}
                </Avatar>
                <MessageListItemText username={(isMyMessage) ? t('message_list.my_message_name') : message.user.username}
                                     date={message.date}
                                     message={message.message}
                />
            </ListItem>
        );
    }
}

MessageListItem.propTypes = {
    message: PropTypes.object.isRequired,
    user: PropTypes.object,
};

export default translate()(withStyles(styles)(MessageListItem));
