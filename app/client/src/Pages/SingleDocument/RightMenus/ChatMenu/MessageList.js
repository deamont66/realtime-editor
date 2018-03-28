import React from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import withStyles from 'material-ui/styles/withStyles';
import moment from 'moment';

import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import {CircularProgress} from 'material-ui/Progress';
import List from 'material-ui/List';

import MessageListItem from './MessageListItem';

const styles = theme => ({
    root: {
        flex: 1,
        maxHeight: 'calc(100vh + 16px - 49px - 58px - 64px - 72px - 3px)',
        overflow: 'auto',
        borderTop: `1px solid ${theme.palette.grey[300]}`,
        borderBottom: `1px solid ${theme.palette.grey[300]}`
    },
    topAction: {
        marginTop: theme.spacing.unit
    }
});

class MessageList extends React.Component {

    constructor() {
        super();

        this.state = {
            loading: false,
            showStart: false
        };

        this.isUp = false;
        this.isDown = true;
        this.isLoading = false;
    }

    componentDidMount() {
        document.getElementById('message_list_container').addEventListener('scroll', this.handleContainerScroll);
    }

    componentWillUnmount() {
        document.getElementById('message_list_container').removeEventListener('scroll', this.handleContainerScroll);
    }

    componentDidUpdate(prevProps) {
        if (this.props.messages !== prevProps.messages) {
            if (this.isDown) {
                this.scrollDown();
            } else if (this.isUp) {
                this.scrollUp();
            }
        }
    }

    componentWillReceiveProps() {
        this.isLoading = false;
        this.setState({
            loading: false
        });
    }

    handleContainerScroll = (evt) => {
        this.isUp = evt.target.scrollTop === 0;
        this.isDown = evt.target.offsetHeight + evt.target.scrollTop === evt.target.scrollHeight;

        if (this.isUp && !this.isLoading && !this.state.showStart) {
            this.loadMore();
        }
    };

    loadMore = () => {
        this.isLoading = true;
        this.props.onLoadMoreChatMessage(() => {
            this.setState({
                showStart: true,
                loading: false
            })
        });
        this.setState({
            loading: true
        });
    };

    scrollDown = () => {
        if (this.down.scrollIntoView)
            this.down.scrollIntoView();
    };

    scrollUp = () => {
        document.getElementById('message_list_container').scrollTop = 2;
    };

    render() {
        const {classes, t} = this.props;

        return (
            <Grid item xs={12} className={classes.root} id={'message_list_container'}>

                {this.state.showStart && (
                    <Typography align={'center'} component={'div'} className={classes.topAction}>
                        {t('message_list.chat_start')}
                    </Typography>
                )}
                {this.state.loading && (
                    <Typography align={'center'} component={'div'} className={classes.topAction}>
                        <CircularProgress color={'secondary'}/>
                    </Typography>
                )}
                {!this.state.loading && !this.state.showStart && this.props.messages.length !== 0 && (
                    <Typography align={'center'} component={'div'} className={classes.topAction}>
                        <Button size={'small'} onClick={this.loadMore}>
                            {t('message_list.load_more_button')}
                        </Button>
                    </Typography>
                )}
                <List>
                    {this.props.messages.sort((a, b) => {
                        return moment(a.date).isBefore(b.date) ? -1 : 1;
                    }).map((message) => {
                        return (
                            <MessageListItem key={message._id} message={message} user={this.props.user}/>
                        )
                    })}
                </List>
                {this.props.messages.length === 0 && (
                    <Typography align={'center'} component={'div'} className={classes.topAction}>
                        {t('message_list.empty')}
                    </Typography>
                )}
                <span id={'message_list_down'} ref={down => this.down = down}/>
            </Grid>
        );
    }
}

MessageList.propTypes = {
    user: PropTypes.object,
    messages: PropTypes.array.isRequired,
    onLoadMoreChatMessage: PropTypes.func.isRequired
};

export default translate()(withStyles(styles)(MessageList));
