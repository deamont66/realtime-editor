import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {translate} from 'react-i18next';
import withStyles from 'material-ui/styles/withStyles';

import Paper from 'material-ui/Paper';

import MetaTags from "../../Components/MetaTags";
import {ForgotPasswordRequestFrom, ForgotPasswordChangeForm} from "./";

const styles = theme => ({
    root: theme.mixins.gutters({
        paddingTop: theme.typography.pxToRem(16),
        paddingBottom: theme.typography.pxToRem(16),
        marginTop: theme.typography.pxToRem(theme.spacing.unit * 3),
        maxWidth: theme.typography.pxToRem(450),
        marginLeft: 'auto',
        marginRight: 'auto',
    }),
});

class ForgotPassword extends React.Component {

    render() {
        const {t, classes} = this.props;

        return (
            <Paper elevation={4} className={classes.root}>
                <MetaTags title={t('app.titles.forgot_password')}/>
                <Switch>
                    <Route path={'/forgot-password/:token'} render={(props) => (
                        <ForgotPasswordChangeForm {...props}/>
                    )}/>
                    <Route exact path={'/forgot-password'} render={(props) => (
                        <ForgotPasswordRequestFrom {...props}/>
                    )}/>
                    <Redirect to={'/forgot-password'}/>
                </Switch>

            </Paper>
        );
    }
}

ForgotPassword.propTypes = {};

export default translate()(withStyles(styles)(ForgotPassword));
