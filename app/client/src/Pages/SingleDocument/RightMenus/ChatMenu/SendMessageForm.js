import React from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import withStyles from 'material-ui/styles/withStyles';

import Grid from 'material-ui/Grid';
import {FormControl} from 'material-ui/Form';
import Input from 'material-ui/Input';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';

import Send from 'material-ui-icons/Send';

const styles = theme => ({
    root: {
        flex: 1,
        flexGrow: 0
    },
    formControl: {
        width: 'calc(100% - 48px)',
        paddingLeft: theme.spacing.unit * 2
    },
    sendButton: {
        // eslint-disable-next-line
        ['&:hover, &:focus']: {
            color: theme.palette.secondary.main
        }
    }
});

class SendMessageForm extends React.Component {

    constructor() {
        super();

        this.state = {
            message: ''
        }
    }

    handleMessageChange = evt => {
        if(evt.target.value > 5000) return;
        this.setState({
            message: evt.target.value
        })
    };

    handleMessageSubmit = evt => {
        evt.preventDefault();

        if (this.state.message) {
            this.props.onMessageSubmit(this.state.message, () => {
                // after self message cheat, don't judge me
                document.getElementById('message_list_down').scrollIntoView();
                this.setState({
                    message: ''
                });
            });
        }
    };

    render() {
        const {classes, t} = this.props;

        return (
            <Grid item xs={12} className={classes.root}>
                <form onSubmit={this.handleMessageSubmit} className="form-group">
                    <FormControl className={classes.formControl}>
                        <Input id="username_input" value={this.state.message} placeholder={t('send_message_form.input_placeholder')}
                               disableUnderline autoComplete="off"
                               onChange={this.handleMessageChange}/>
                    </FormControl>

                    <Tooltip title={t('send_message_form.submit_title')}>
                        <IconButton type="submit" className={classes.sendButton}>
                            <Send/>
                        </IconButton>
                    </Tooltip>
                </form>
            </Grid>
        );
    }
}

SendMessageForm.propTypes = {
    onMessageSubmit: PropTypes.func.isRequired,
};

export default translate()(withStyles(styles)(SendMessageForm));
