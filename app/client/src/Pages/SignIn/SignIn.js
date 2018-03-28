import React from 'react';
import {translate} from 'react-i18next';
import withStyles from 'material-ui/styles/withStyles';

import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import {FormControl, FormHelperText, FormControlLabel} from 'material-ui/Form';
import Input, {InputLabel} from 'material-ui/Input';
import Checkbox from 'material-ui/Checkbox';
import Button from 'material-ui/Button';
import {LinearProgress} from 'material-ui/Progress';

import UserStore from '../../Stores/UserStore';
import MaterialLink from '../../Components/MaterialLink';
import MetaTags from '../../Components/MetaTags';
import SocialButtons from './SocialButtons';

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

class SignIn extends React.Component {

    constructor() {
        super();

        this.state = {
            username: '',
            password: '',
            rememberMe: false,

            message: null,
            loading: false
        }
    }

    handleChange = key => evt => {
        this.setState({[key]: evt.target.value});
    };

    handleSubmit = evt => {
        evt.preventDefault();
        this.setState({
            message: null,
            loading: true
        });

        UserStore.singIn(this.state.username, this.state.password, this.state.rememberMe).then(() => {
            this.setState({loading: false});
            this.props.history.push('/document');
        }).catch((error) => {
            this.setState({
                message: this.props.t(error.response.data.message),
                loading: false
            });
        });
    };

    render() {
        const {classes, t} = this.props;

        return (
            <Paper elevation={4} className={classes.root}>
                <MetaTags title={t('app.titles.sign_in')}/>
                <form onSubmit={this.handleSubmit}>
                    <Grid container className={classes.root}>
                        <Grid item xs={12}>
                            <Typography variant="headline" align="center">
                                {t('signIn.headline')}
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth className={classes.formControl} error={this.state.message !== null}>
                                <InputLabel htmlFor="username_input">{t('username.label')}</InputLabel>
                                <Input id="username_input" value={this.state.username}
                                       onChange={this.handleChange('username')}/>
                            </FormControl>
                            <FormControl fullWidth className={classes.formControl} error={this.state.message !== null}>
                                <InputLabel htmlFor="password_input">{t('password.label')}</InputLabel>
                                <Input id="password_input" value={this.state.password}
                                       onChange={this.handleChange('password')} type="password"/>
                                {this.state.message !== null && <FormHelperText>
                                    {this.state.message}
                                </FormHelperText>}
                            </FormControl>
                        </Grid>

                        <Grid item sm={6} xs={12}>
                            <FormControl fullWidth>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={this.state.rememberMe} onChange={(evt) => this.setState({rememberMe: evt.target.checked})}/>
                                    }
                                    label={t('signIn.remember_label')}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <Typography component="p" align="left" className={classes.link}>
                                <MaterialLink to="/forgot-password">{t('signIn.forgot_link_text')}</MaterialLink>
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Button type="submit" fullWidth size="large" variant="raised" color="secondary"
                                    className={classes.button}>
                                {t('signIn.submit_button')}
                            </Button>
                            {this.state.loading && <LinearProgress color="secondary"/>}
                        </Grid>

                        <Grid item xs={12}>
                            <Typography component="p" align="center">{t('signIn.or_text')}</Typography>
                        </Grid>

                        <SocialButtons/>

                        <Grid item xs={12}>
                            <Typography component="p" align={'center'} className={classes.signUp}>
                                {t('signIn.sign_up.text')} <MaterialLink
                                to="/sign-up">{t('signIn.sign_up.link_text')}</MaterialLink>
                            </Typography>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        );
    }
}

SignIn.propTypes = {};

export default translate()(withStyles(styles)(SignIn));
