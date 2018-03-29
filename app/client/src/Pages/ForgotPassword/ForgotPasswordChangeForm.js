import React from 'react';
import {translate} from 'react-i18next';
import withStyles from 'material-ui/styles/withStyles';

import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import {FormControl, FormHelperText} from 'material-ui/Form';
import Input, {InputLabel} from 'material-ui/Input';
import {LinearProgress, CircularProgress} from 'material-ui/Progress';
import Button from 'material-ui/Button';

import MaterialLink from '../../Components/MaterialLink';
import PasswordStrengthEstimator, {estimateStrength} from '../../Components/PasswordStrengthEstimator';
import AuthAPIHandler from '../../APIHandlers/AuthAPIHandler';

const styles = theme => ({
    root: theme.mixins.gutters({
        paddingTop: theme.typography.pxToRem(16),
        paddingBottom: theme.typography.pxToRem(16),
        marginTop: theme.typography.pxToRem(theme.spacing.unit * 3),
        maxWidth: theme.typography.pxToRem(450),
        marginLeft: 'auto',
        marginRight: 'auto',
    }),
    formControl: {
        margin: `${theme.typography.pxToRem(theme.spacing.unit)} 0`,
    },
    link: {
        [theme.breakpoints.up('sm')]: {
            marginTop: theme.typography.pxToRem(14),
            textAlign: 'right',
        }
    },
    signIp: {
        fontSize: theme.typography.pxToRem(16)
    }
});

class ForgotPasswordChangeForm extends React.Component {

    constructor() {
        super();

        this.state = {
            newPassword: '',
            newPassword2: '',

            valid: null,
            error: null,
            message: null,
            send: false
        }
    }

    componentDidMount() {
        this.loadValidity(this.props.match.params.token);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.match.params.token !== nextProps.match.params.token) {
            this.loadValidity(this.props.match.params.token);
        }
    }

    loadValidity = (token) => {
        AuthAPIHandler.fetchValidateForgotPasswordToken(token).then(() => {
            this.setState({valid: true});
        }).catch(() => {
            this.setState({valid: false});
        });
    };

    handleChange = key => evt => {
        this.setState({[key]: evt.target.value});
    };

    handleSubmit = evt => {
        evt.preventDefault();
        if(this.state.send) return;

        let message = null;
        let error = null;

        if (!this.state.newPassword) {
            message = this.props.t('password.validation.required');
            error = 'newPassword';
        } else if (this.state.newPassword !== this.state.newPassword2) {
            message = this.props.t('newPassword.validation.match');
            error = 'newPassword2';
        }

        estimateStrength(this.state.newPassword).then((res) => {
            if (error === null && res.guesses <= 100) {
                message = this.props.t('password.validation.easy');
                error = 'newPassword';
            }
            console.log(message, error);

            this.setState({
                message: message,
                error: error
            });

            if (message !== null) return;

            this.setState({loading: true});

            AuthAPIHandler.fetchChangeForgotPassword(this.props.match.params.token, this.state.newPassword).then(() => {
                this.setState({send: true, loading: false, message: this.props.t('forgotPasswordChange.success')});
            }).catch((err) => {
                this.setState({error: 'newPassword2', loading: false, message: this.props.t(err.response.data.message)});
            });
        });
    };

    render() {
        const {classes, t} = this.props;

        if (this.state.valid === null) {
            return (
                <Typography align={'center'} component={'div'}>
                    <CircularProgress/>
                </Typography>
            );
        } else if (this.state.valid === false) {
            return (
                <Typography align={'center'} component={'div'}>
                    {t('forgotPasswordChange.invalid_token')}
                </Typography>
            );
        }

        return (
            <form onSubmit={this.handleSubmit}>
                <Grid container className={classes.root}>
                    <Grid item xs={12}>
                        <Typography variant="headline" align="center">
                            {t('forgotPasswordChange.headline')}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl fullWidth className={classes.formControl}
                                     error={this.state.error === 'newPassword'}>
                            <InputLabel htmlFor="newPassword_input">{t('newPassword.label')}</InputLabel>
                            <Input id="newPassword_input" value={this.state.password}
                                   onChange={this.handleChange('newPassword')} type="password"/>
                            <FormHelperText>
                                {this.state.error === 'newPassword' ?
                                    this.state.message : (
                                        <PasswordStrengthEstimator password={this.state.newPassword}/>
                                    )
                                }
                            </FormHelperText>
                        </FormControl>
                        <FormControl fullWidth className={classes.formControl}
                                     error={this.state.error === 'newPassword2'}>
                            <InputLabel htmlFor="new_password2_input">{t('newPassword.againLabel')}</InputLabel>
                            <Input id="new_password2_input" value={this.state.newPassword2}
                                   onChange={this.handleChange('newPassword2')} type="password"/>
                            <FormHelperText>
                                {this.state.message !== null && this.state.error !== 'newPassword' &&
                                this.state.message}
                            </FormHelperText>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <Button type="submit" fullWidth size="large" variant="raised" color="secondary"
                                className={classes.button}>
                            {t('forgotPasswordChange.submit_button')}
                        </Button>
                        {this.state.loading && <LinearProgress color="secondary"/>}
                    </Grid>

                    <Grid item xs={12}>
                        <Typography component="p" align={'center'} className={classes.signIp}>
                            {t('forgotPasswordRequest.sign_in.text')} <MaterialLink
                            to="/sign-in">{t('forgotPasswordRequest.sign_in.link_text')}</MaterialLink>
                        </Typography>
                    </Grid>
                </Grid>
            </form>
        );
    }
}

ForgotPasswordChangeForm.propTypes = {};

export default withStyles(styles)(translate()(ForgotPasswordChangeForm));
