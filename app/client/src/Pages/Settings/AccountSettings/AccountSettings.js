import React from 'react';
import PropTypes from 'prop-types';

import withStyles from 'material-ui/styles/withStyles';

import {FormControl, FormHelperText} from 'material-ui/Form';
import Input, {InputLabel} from 'material-ui/Input';
import Snackbar from 'material-ui/Snackbar';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';

import axios from '../../../Utils/Axios';
import UserStore from "../../../Stores/UserStore";
import SubmitButtons from "../SubmitButtons";

const styles = theme => ({
    close: {
        width: theme.spacing.unit * 4,
        height: theme.spacing.unit * 4,
    },
    formControl: {
        margin: `${theme.spacing.unit}px 0`,
    }
});

class AccountSettings extends React.Component {


    constructor(props) {
        super(props);

        this.state = this.getInitialState(props);
        this.state.message = '';
        this.state.error = '';
        this.state.open = false;
    }

    getInitialState(props) {
        return {
            username: props.user.username,
            email: props.user.email,

            password: '',
            newPassword: '',
            newPassword2: '',
        }
    }

    showMessage = (message, error) => {
        this.setState({
            open: true,
            message: message,
            error: error
        });
    };

    handleClose = () => {
        this.setState({
            open: false
        });
    };

    componentWillReceiveProps(newProps) {
        this.setState(this.getInitialState(newProps));
    }

    handleChange = type => evt => {
        this.setState({
            [type]: evt.target.value
        });
    };


    handleSubmit(evt) {
        evt.preventDefault();

        const data = {};
        let isEmpty = true;
        let errorMessage = null;
        let error = null;
        if (this.state.username !== this.props.user.username) {
            data.username = this.state.username;
            isEmpty = false;
        }
        if (this.state.email !== this.props.user.email) {
            // eslint-disable-next-line no-useless-escape
            if ((!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.state.email))) {
                errorMessage = 'Field email has to be valid email address';
                error = 'email';
            } else {
                data.email = this.state.email;
                isEmpty = false;
            }
        }
        if (this.state.newPassword) {
            if (this.state.newPassword !== this.state.newPassword2) {
                errorMessage = 'Fields with new password must match';
                error = 'newPassword2';
            }
            data.newPassword = this.state.newPassword;
            isEmpty = false;
        }
        if (!this.state.password) {
            errorMessage = 'Field password is required';
            error = 'password';
        } else {
            data.password = this.state.password;
        }

        if (isEmpty || errorMessage) {
            this.showMessage(errorMessage || 'No changes were made', error);
            return;
        }

        axios.put('/user', data).then(() => {
            UserStore.checkLoggedIn();
            this.showMessage('Changes saved');
        }).catch((err) => {
            let error = 'username';
            let message = error.message;

            if (err.response) {
                const code = err.response.data.code;
                if (code === 4003) {
                    error = 'password';
                }
                message = err.response.data.message;
            }

            this.showMessage(message, error);
        });
    }

    render() {
        const {classes} = this.props;

        return (
            <div className="Comp-AccountSettings">
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <Typography variant="title" gutterBottom>
                        General settings
                    </Typography>
                    <FormControl fullWidth className={classes.formControl} error={this.state.error === 'username'}>
                        <InputLabel htmlFor="username_input">Username</InputLabel>
                        <Input id="username_input" value={this.state.username}
                               onChange={this.handleChange('username')}/>
                        <FormHelperText>{this.state.error === 'username' ? this.state.message : 'Choose how will other users see you'}</FormHelperText>
                    </FormControl>
                    <FormControl fullWidth className={classes.formControl} error={this.state.error === 'email'}>
                        <InputLabel htmlFor="email_input">Email address</InputLabel>
                        <Input id="email_input" value={this.state.email} onChange={this.handleChange('email')}/>
                        <FormHelperText>
                            {this.state.error === 'email' ?
                                this.state.message : 'No one can see this, we\'ll only used it in case of you forgetting your password'}
                        </FormHelperText>
                    </FormControl>

                    <Typography variant="title" gutterBottom>
                        <br/>
                        Password settings
                    </Typography>

                    <FormControl fullWidth className={classes.formControl}>
                        <InputLabel htmlFor="new_password_input">New password</InputLabel>
                        <Input id="new_password_input" value={this.state.newPassword}
                               onChange={this.handleChange('newPassword')} type="password"/>
                        <FormHelperText>Only enter if you want to change password.</FormHelperText>
                    </FormControl>

                    <FormControl fullWidth className={classes.formControl} error={this.state.error === 'newPassword2'}>
                        <InputLabel htmlFor="new_password2_input">New password again</InputLabel>
                        <Input id="new_password2_input" value={this.state.newPassword2}
                               onChange={this.handleChange('newPassword2')} type="password"/>
                        <FormHelperText>
                            {this.state.error === 'newPassword2' ?
                                this.state.message : 'Please enter same password as before.'}
                        </FormHelperText>
                    </FormControl>


                    <br/>


                    <FormControl fullWidth className={classes.formControl} error={this.state.error === 'password'}>
                        <InputLabel htmlFor="password_input">Current password</InputLabel>
                        <Input id="password_input" value={this.state.password}
                               onChange={this.handleChange('password')} type="password"/>
                        <FormHelperText>Enter your current password so we know it is really you.</FormHelperText>
                    </FormControl>

                    <SubmitButtons onReset={() => this.setState(this.getInitialState(this.props))}/>
                </form>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.open}
                    autoHideDuration={6000}
                    onClose={this.handleClose}
                    SnackbarContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{this.state.message}</span>}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            className={this.props.classes.close}
                            onClick={this.handleClose}
                        >
                            <CloseIcon/>
                        </IconButton>,
                    ]}
                />
            </div>
        );
    }
}

AccountSettings.propTypes = {
    user: PropTypes.object.isRequired,
};

export default withStyles(styles)(AccountSettings);
