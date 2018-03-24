import React from 'react';

import withStyles from 'material-ui/styles/withStyles';
import {translate} from 'react-i18next';

import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import {FormControl, FormHelperText} from 'material-ui/Form';
import Input, {InputLabel} from 'material-ui/Input';
import Button from 'material-ui/Button';
import {LinearProgress} from 'material-ui/Progress';

import UserStore from "../../Stores/UserStore";
import PasswordStrengthEstimator, {estimateStrength} from "../../Components/PasswordStrengthEstimator";
import MaterialLink from "../../Components/MaterialLink";
import MetaTags from "../../Components/MetaTags";

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
    signUp: {
        fontSize: theme.typography.pxToRem(16)
    }
});

class SignUp extends React.Component {

    constructor() {
        super();

        this.state = {
            email: '',
            username: '',
            password: '',

            message: null,
            error: '',
            loading: false
        }
    }

    handleChange = key => evt => {
        this.setState({[key]: evt.target.value});
    };

    handleSubmit = (evt) => {
        evt.preventDefault();

        let message = null;
        let error = null;

        if (!this.state.email) {
            message = this.props.t('email.validation.required');
            error = 'email';
            // eslint-disable-next-line no-useless-escape
        } else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.state.email)) {
            message = this.props.t('email.validation.valid');
            error = 'email';
        } else if (!this.state.username) {
            message = this.props.t('username.validation.required');
            error = 'username';
        } else if (!this.state.password) {
            message = this.props.t('password.validation.required');
            error = 'password';
        }

        estimateStrength(this.state.password, [this.state.username, this.state.email]).then((res) => {
            console.log(res);

            if (res.guesses <= 100) {
                message = this.props.t('password.validation.easy');
                error = 'password';
            }

            this.setState({
                message: message,
                error: error
            });

            if (message !== null) return;

            this.setState({loading: true});

            UserStore.singUp(this.state.username, this.state.password, this.state.email).then(() => {
                this.setState({loading: false});
                this.props.history.push('/document');
            }).catch((error) => {
                this.setState({
                    message: this.props.t(error.response.data.message),
                    error: error.response.data.code === 4004 ? 'username' : '',
                    loading: false
                });
            });
        });
    };

    render() {
        const {classes, t} = this.props;

        return (
            <Paper elevation={4} className={classes.root}>
                <MetaTags title={t('app.titles.sign_up')}/>
                <form onSubmit={this.handleSubmit}>
                    <Grid container className={classes.root}>
                        <Grid item xs={12}>
                            <Typography variant="headline" align="center">
                                {t('signUp.headline')}
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth className={classes.formControl} error={this.state.error === 'email'}>
                                <InputLabel htmlFor="email_input">{t('email.label')}</InputLabel>
                                <Input id="email_input" value={this.state.email}
                                       onChange={this.handleChange('email')}/>
                                {this.state.error === 'email' && <FormHelperText>
                                    {this.state.message}
                                </FormHelperText>}
                            </FormControl>
                            <FormControl fullWidth className={classes.formControl}
                                         error={this.state.error === 'username'}>
                                <InputLabel htmlFor="username_input">{t('username.label')}</InputLabel>
                                <Input id="username_input" value={this.state.username}
                                       onChange={this.handleChange('username')}/>
                                {this.state.error === 'username' && <FormHelperText>
                                    {this.state.message}
                                </FormHelperText>}
                            </FormControl>
                            <FormControl fullWidth className={classes.formControl}
                                         error={this.state.message !== null && !['username', 'email'].includes(this.state.error)}>
                                <InputLabel htmlFor="password_input">{t('password.label')}</InputLabel>
                                <Input id="password_input" value={this.state.password}
                                       onChange={this.handleChange('password')} type="password"/>
                                <FormHelperText>
                                    {this.state.message !== null && !['username', 'email'].includes(this.state.error) && this.state.message}
                                    {(this.state.message === null || ['username', 'email'].includes(this.state.error)) && (
                                        <PasswordStrengthEstimator password={this.state.password} inputs={[this.state.username, this.state.email]}/>
                                    )}
                                </FormHelperText>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <Button type="submit" fullWidth size="large" variant="raised" color="secondary"
                                    className={classes.button}>
                                {t('signUp.submit_button')}
                            </Button>
                            {this.state.loading && <LinearProgress color="secondary"/>}
                        </Grid>

                        <Grid item xs={12}>
                            <Typography component="p" align={'center'} className={classes.signUp}>
                                {t('signUp.sign_in.text')} <MaterialLink
                                to="/sign-in">{t('signUp.sign_in.link_text')}</MaterialLink>
                            </Typography>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        );
    }
}

SignUp.propTypes = {};

export default translate()(withStyles(styles)(SignUp));
