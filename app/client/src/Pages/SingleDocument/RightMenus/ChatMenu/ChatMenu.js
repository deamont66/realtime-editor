import React from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import withStyles from 'material-ui/styles/withStyles';

import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';

import ChatMessages from './ChatMessages';

const styles = theme => ({
    root: {
        height: '100%',
        flexWrap: 'nowrap'
    },
    titleWrapper: {
        flex: 1,
        flexGrow: 0
    },
    title: {
        fontWeight: 500
    },
    messageWrapper: {
        flex: 1,
        margin: '0 -8px -8px',
        width: 316,
        maxWidth: 'calc(100% + 16px)',
        [theme.breakpoints.down('sm')]: {
            width: 'calc(100% + 16px)',
            maxWidth: 'auto'
        }
    },
});

class ChatMenu extends React.Component {

    render() {
        const {t, classes} = this.props;

        return (
            <Grid container direction={'column'} spacing={0} className={classes.root}>
                <Grid item xs={12} className={classes.titleWrapper}>
                    <Typography className={classes.title} variant={'subheading'}
                                component={'h2'} gutterBottom>{t('chat_menu.title')}</Typography>
                </Grid>

                <Grid item xs={12} className={classes.messageWrapper}>
                    <ChatMessages messages={this.props.messages} user={this.props.user}
                                  onMessageSubmit={this.props.onMessageSubmit}
                                  onClose={this.props.onClose}
                                  onLoadMoreChatMessage={this.props.onLoadMoreChatMessage}
                    />
                </Grid>
            </Grid>
        );
    }
}

ChatMenu.propTypes = {
    user: PropTypes.object,
    messages: PropTypes.array.isRequired,
    onMessageSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onLoadMoreChatMessage: PropTypes.func.isRequired,
};

ChatMenu.defaultProps = {
    onClose: () => {
    }
};

export default translate()(withStyles(styles)(ChatMenu));
