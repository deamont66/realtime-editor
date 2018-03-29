import React from 'react';
import {translate} from 'react-i18next';
import withStyles from 'material-ui/styles/withStyles';

import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import {FormControl, FormHelperText} from 'material-ui/Form';
import Input, {InputLabel} from 'material-ui/Input';
import {LinearProgress} from 'material-ui/Progress';
import Button from 'material-ui/Button';

import MaterialLink from '../../Components/MaterialLink';
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
    signIn: {
        fontSize: theme.typography.pxToRem(16)
    }
});

class ForgotPasswordRequestFrom extends React.Component {

    constructor() {
        super();

        this.state = {
            username: '',
            email: '',

            message: null,
            error: null,
            loading: false,
            send: false
        }
    }

    handleChange = key => evt => {
        this.setState({[key]: evt.target.value, send: false});
    };

    handleSubmit = evt => {
        evt.preventDefault();
        if(this.state.send) return;

        let message = null;
        let error = null;

        if (!this.state.username) {
            message = this.props.t('username.validation.required');
            error = 'username';
        } else if (!this.state.email) {
            message = this.props.t('email.validation.required');
            error = 'email';
            // eslint-disable-next-line no-useless-escape
        } else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.state.email)) {
            message = this.props.t('email.validation.valid');
            error = 'email';
        }

        this.setState({
            message: message,
            error: error
        });

        if (message !== null) return;

        this.setState({loading: true});

        AuthAPIHandler.fetchRequestForgotPassword(this.state.username, this.state.email).then((res) => {
            this.setState({
                send: true,
                loading: false,
                message: this.props.t(res.data.message)
            })
        }).catch((err) => {
            console.error(err);
            this.setState({loading: false});
        })
    };

    render() {
        const {classes, t} = this.props;

        return (
            <form onSubmit={this.handleSubmit}>
                <Grid container className={classes.root}>
                    <Grid item xs={12}>
                        <Typography variant="headline" align="center">
                            {t('forgotPasswordRequest.headline')}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl fullWidth className={classes.formControl} error={this.state.error === 'username'}>
                            <InputLabel htmlFor="username_input">{t('username.label')}</InputLabel>
                            <Input id="username_input" value={this.state.username}
                                   onChange={this.handleChange('username')}/>
                            {this.state.error === 'username' && <FormHelperText>
                                {this.state.message}
                            </FormHelperText>}
                        </FormControl>
                        <FormControl fullWidth className={classes.formControl} error={this.state.error === 'email'}>
                            <InputLabel htmlFor="email_input">{t('email.label')}</InputLabel>
                            <Input id="email_input" value={this.state.email}
                                   onChange={this.handleChange('email')}/>
                            {this.state.error !== 'username' && this.state.message !== null && <FormHelperText>
                                {this.state.message}
                            </FormHelperText>}
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <Button type="submit" fullWidth size="large" variant="raised" color="secondary"
                                className={classes.button}>
                            {t('forgotPasswordRequest.submit_button')}
                        </Button>
                        {this.state.loading && <LinearProgress color="secondary"/>}
                    </Grid>

                    <Grid item xs={12}>
                        <Typography component="p" align={'center'} className={classes.signIn}>
                            {t('forgotPasswordRequest.sign_in.text')} <MaterialLink
                            to="/sign-in">{t('forgotPasswordRequest.sign_in.link_text')}</MaterialLink>
                        </Typography>
                    </Grid>
                </Grid>
            </form>
        );
    }
}

ForgotPasswordRequestFrom.propTypes = {};

export default withStyles(styles)(translate()(ForgotPasswordRequestFrom));
