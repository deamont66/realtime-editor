import React from 'react';
import {translate} from 'react-i18next';
import PropTypes from 'prop-types';

import withStyles from 'material-ui/styles/withStyles';

import {FormControl, FormHelperText} from 'material-ui/Form';
import Input, {InputLabel} from 'material-ui/Input';
import Snackbar from 'material-ui/Snackbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';

import UserAPIHandler from '../../../APIHandlers/UserAPIHandler';
import UserStore from '../../../Stores/UserStore';
import SubmitButtons from '../SubmitButtons';
import PasswordStrengthEstimator, {estimateStrength} from '../../../Components/PasswordStrengthEstimator';
import MetaTags from '../../../Components/MetaTags';

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

            loading: false
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
                errorMessage = this.props.t('email.validation.valid');
                error = 'email';
            } else {
                data.email = this.state.email;
                isEmpty = false;
            }
        }
        if (this.state.newPassword) {
            if (this.state.newPassword !== this.state.newPassword2) {
                errorMessage = this.props.t('newPassword.validation.match');
                error = 'newPassword2';
            }
            data.newPassword = this.state.newPassword;
            isEmpty = false;
        }
        if (!this.state.password) {
            if (this.props.user.has_password) {
                errorMessage = this.props.t('password.validation.required');
                error = 'password';
            }
        } else {
            data.password = this.state.password;
        }

        const promise = (!data.newPassword) ? Promise.resolve() : estimateStrength(this.state.newPassword, [this.state.username, this.state.email]);
        promise.then((res) => {
            if (res && res.guesses <= 100) {
                errorMessage = this.props.t('password.validation.easy');
                error = 'newPassword2';
            }

            if (isEmpty || errorMessage) {
                this.showMessage(errorMessage || this.props.t('settings.no_changes'), error);
                return;
            }

            this.setState({loading: true});

            UserAPIHandler.fetchUpdateUser(data).then(() => {
                UserStore.checkLoggedIn();
                this.showMessage(this.props.t('settings.saved'));
                this.setState({loading: false});
            }).catch((err) => {
                let error = 'username';
                let message = error.message;

                if (err.response) {
                    const code = err.response.data.code;
                    if (code === 4003) {
                        error = 'password';
                    }
                    message = this.props.t(err.response.data.message);
                }
                this.showMessage(message, error);
                this.setState({loading: false});
            });
        });

    }

    render() {
        const {classes, t} = this.props;

        return (
            <div>
                <MetaTags title={t('app.titles.account_settings')}/>
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <Typography variant="title" gutterBottom>
                        {t('account_settings.general_title')}
                    </Typography>
                    <FormControl fullWidth className={classes.formControl} error={this.state.error === 'username'}>
                        <InputLabel htmlFor="username_input">{t('username.label')}</InputLabel>
                        <Input id="username_input" value={this.state.username}
                               onChange={this.handleChange('username')}/>
                        <FormHelperText>{this.state.error === 'username' ? this.state.message : t('username.helper')}</FormHelperText>
                    </FormControl>
                    <FormControl fullWidth className={classes.formControl} error={this.state.error === 'email'}>
                        <InputLabel htmlFor="email_input">{t('email.label')}</InputLabel>
                        <Input id="email_input" value={this.state.email} onChange={this.handleChange('email')}/>
                        <FormHelperText>
                            {this.state.error === 'email' ?
                                this.state.message : t('email.helper')}
                        </FormHelperText>
                    </FormControl>

                    <Typography variant="title" gutterBottom>
                        <br/>
                        {t('account_settings.password_title')}
                    </Typography>

                    <FormControl fullWidth className={classes.formControl}>
                        <InputLabel htmlFor="new_password_input">{t('newPassword.label')}</InputLabel>
                        <Input id="new_password_input" value={this.state.newPassword}
                               onChange={this.handleChange('newPassword')} type="password"/>

                        <FormHelperText>{this.state.newPassword.length === 0 ? (
                            t('newPassword.helper')
                        ) : (
                            <PasswordStrengthEstimator password={this.state.newPassword}
                                                       inputs={[this.state.username, this.state.email]}/>
                        )}</FormHelperText>
                    </FormControl>

                    <FormControl fullWidth className={classes.formControl} error={this.state.error === 'newPassword2'}>
                        <InputLabel htmlFor="new_password2_input">{t('newPassword.againLabel')}</InputLabel>
                        <Input id="new_password2_input" value={this.state.newPassword2}
                               onChange={this.handleChange('newPassword2')} type="password"/>
                        <FormHelperText>
                            {this.state.error === 'newPassword2' ?
                                this.state.message : t('newPassword.againHelper')}
                        </FormHelperText>
                    </FormControl>

                    {this.props.user.has_password && (
                        <FormControl fullWidth className={classes.formControl} error={this.state.error === 'password'}>
                            <InputLabel htmlFor="password_input">{t('password.currentLabel')}</InputLabel>
                            <Input id="password_input" value={this.state.password}
                                   onChange={this.handleChange('password')} type="password"/>
                            <FormHelperText>{t('password.currentHelper')}</FormHelperText>
                        </FormControl>
                    )}

                    <SubmitButtons loading={this.state.loading}
                                   onReset={() => this.setState(this.getInitialState(this.props))}/>
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

export default translate()(withStyles(styles)(AccountSettings));
