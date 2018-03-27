import React from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import withStyles from 'material-ui/styles/withStyles';

import Grid from 'material-ui/Grid';
import {FormControl} from 'material-ui/Form';
import Input from 'material-ui/Input';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import Tooltip from 'material-ui/Tooltip';

import Send from 'material-ui-icons/Send';
import LinkButton from "../../../../Components/LinkButton";

const styles = theme => ({
    root: {
        flex: 1,
        flexGrow: 0,
        position: 'relative'
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
    },
    signInOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        backgroundColor: theme.palette.action.disabled,
        textAlign: 'center',
        padding: theme.spacing.unit
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

        if (this.state.message && this.props.user) {
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
                    {!this.props.user && <div className={classes.signInOverlay}>
                        <LinkButton to={'/sign-in'} color={'secondary'} variant={'raised'} size={'small'}>{t('send_message_form.sign_button_text')}</LinkButton>
                    </div>}

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
    user: PropTypes.object,
    onMessageSubmit: PropTypes.func.isRequired,
};

export default translate()(withStyles(styles)(SendMessageForm));
