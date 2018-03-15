import React from 'react';

import withStyles from 'material-ui/styles/withStyles';

import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import {FormControl, FormHelperText} from 'material-ui/Form';
import Input, {InputLabel} from 'material-ui/Input';
import Button from 'material-ui/Button';

import UserStore from "../../Stores/UserStore";
import MaterialLink from "../../Components/MaterialLink";

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
            error: ''
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
            message = 'Field email is required';
            error = 'email';
            // eslint-disable-next-line no-useless-escape
        } else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.state.email)) {
            message = 'Field email has to be valid email address';
            error = 'email';
        } else if (!this.state.username) {
            message = 'Field username is required';
            error = 'username';
        } else if (!this.state.password) {
            message = 'Field password is required';
            error = 'password';
        }

        this.setState({
            message: message,
            error: error
        });

        if (message !== null) return;

        UserStore.singUp(this.state.username, this.state.password, this.state.email).then(() => {
            this.props.history.push('/document');
        }).catch((error) => {
            this.setState({
                message: error.response.data.message,
                error: error.response.data.code === 4004 ? 'username' : ''
            });
        });
    };

    render() {
        const {classes} = this.props;

        return (
            <Paper elevation={4} className={classes.root}>
                <form onSubmit={this.handleSubmit}>
                    <Grid container className={classes.root}>
                        <Grid item xs={12}>
                            <Typography variant="headline" align="center">
                                Create new account
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth className={classes.formControl} error={this.state.error === 'email'}>
                                <InputLabel htmlFor="email_input">Email</InputLabel>
                                <Input id="email_input" value={this.state.email}
                                       onChange={this.handleChange('email')}/>
                                {this.state.error === 'email' && <FormHelperText>
                                    {this.state.message}
                                </FormHelperText>}
                            </FormControl>
                            <FormControl fullWidth className={classes.formControl}
                                         error={this.state.error === 'username'}>
                                <InputLabel htmlFor="username_input">Username</InputLabel>
                                <Input id="username_input" value={this.state.username}
                                       onChange={this.handleChange('username')}/>
                                {this.state.error === 'username' && <FormHelperText>
                                    {this.state.message}
                                </FormHelperText>}
                            </FormControl>
                            <FormControl fullWidth className={classes.formControl}
                                         error={this.state.message !== null && !['username', 'email'].includes(this.state.error)}>
                                <InputLabel htmlFor="password_input">Password</InputLabel>
                                <Input id="password_input" value={this.state.password}
                                       onChange={this.handleChange('password')} type="password"/>
                                {this.state.message !== null && !['username', 'email'].includes(this.state.error) &&
                                <FormHelperText>
                                    {this.state.message}
                                </FormHelperText>}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <Button type="submit" fullWidth size="large" variant="raised" color="secondary"
                                    className={classes.button}>
                                Sign Up
                            </Button>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography component="p" align={'center'} className={classes.signUp}>
                                Already have an account? <MaterialLink to="/sign-in">Sing in</MaterialLink>
                            </Typography>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        );
    }
}

SignUp.propTypes = {};

export default withStyles(styles)(SignUp);
