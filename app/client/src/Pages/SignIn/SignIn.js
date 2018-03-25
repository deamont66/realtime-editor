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
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import {LinearProgress} from "material-ui/Progress";

import CTU from "../../Components/Icons/CTU";
import Google from "../../Components/Icons/Google";
import Facebook from "../../Components/Icons/Facebook";
import Twitter from "../../Components/Icons/Twitter";

import UserStore from "../../Stores/UserStore";
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
    },
    socialWrapper: {
        margin: theme.spacing.unit * 2,
        marginTop: 0,
        marginBottom: theme.spacing.unit,
    },
    socialIcon: {
        height: 'auto'
    }
});

class SignIn extends React.Component {

    constructor() {
        super();

        this.state = {
            username: '',
            password: '',

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

        UserStore.singIn(this.state.username, this.state.password).then(() => {
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
                                        <Checkbox/>
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
                            <Typography component="p" align="center">or</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography component="div" align={'center'}>
                                <Tooltip title={t('signIn.CTU')} placement={'right'}>
                                    <IconButton href={'/api/auth/ctu'} size="large" variant="raised" className={classes.socialWrapper}>
                                        <CTU className={classes.socialIcon}/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={t('signIn.google')} placement={'right'}>
                                    <IconButton href={'/api/auth/google'} size="large" variant="raised" className={classes.socialWrapper}>
                                        <Google className={classes.socialIcon}/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={t('signIn.facebook')} placement={'right'}>
                                    <IconButton href={'/api/auth/facebook'} size="large" variant="raised" className={classes.socialWrapper}>
                                        <Facebook className={classes.socialIcon}/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={t('signIn.twitter')} placement={'right'}>
                                    <IconButton href={'/api/auth/twitter'} size="large" variant="raised" className={classes.socialWrapper}>
                                        <Twitter className={classes.socialIcon}/>
                                    </IconButton>
                                </Tooltip>
                            </Typography>
                        </Grid>

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
