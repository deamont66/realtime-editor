import React from 'react';
import {translate} from 'react-i18next';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import PropTypes from 'prop-types';

import SignIn from "./SignIn/SignIn";
import SignUp from "./SignUp/SignUp";
import SingleDocument from "./SingleDocument/SingleDocument";
import MyDocuments from "./Documents/MyDocuments";
import SharedDocuments from "./Documents/SharedDocuments";
import LastDocuments from "./Documents/LastDocuments";
import Settings from "./Settings/Settings";
import Layout from "./Layout/Layout";
import Error404 from "./Errors/Error404";
import MetaTags from "../Components/MetaTags";
import ForgotPassword from "./ForgotPassword";

class Router extends React.Component {

    render() {
        const {t} = this.props;
        return (
            <BrowserRouter>
                <Layout user={this.props.user} onDarkThemeToggle={this.props.onDarkThemeToggle}>
                    <MetaTags description={t('app.description')}/>
                    <Switch>
                        <Route exact path={'/sign-up'} render={(props) => (
                            this.props.user === null ? <SignUp {...props}/> : <Redirect to={'/'}/>)}/>

                        <Route exact path={'/sign-in'} render={(props) => (
                            this.props.user === null ? <SignIn {...props}/> : <Redirect to={'/'}/>)}/>

                        <Route path={'/forgot-password'} render={(props) => (
                            this.props.user === null ? <ForgotPassword {...props}/> :
                                <Redirect to={'/'}/>
                        )}/>

                        <Route exact path={'/'} render={() => (
                            this.props.user === null ? <Redirect to={'/sign-in'}/> : <Redirect to={'/document'}/>)}/>

                        <Route exact path={'/document'} render={(props) => (
                            this.props.user !== null ? <MyDocuments {...props} user={this.props.user}/> :
                                <Redirect to={'/sign-in'}/>
                        )}/>

                        <Route path={'/document/shared'} render={(props) => (
                            this.props.user !== null ? <SharedDocuments {...props} user={this.props.user}/> :
                                <Redirect to={'/sign-in'}/>
                        )}/>

                        <Route path={'/document/history'} render={(props) => (
                            this.props.user !== null ? <LastDocuments {...props} user={this.props.user}/> :
                                <Redirect to={'/sign-in'}/>
                        )}/>

                        <Route path={'/document/:documentId'} render={(props) => (
                            <SingleDocument {...props} user={this.props.user}/>
                        )}/>

                        <Route path={'/settings'} render={(props) => (
                            this.props.user !== null ? <Settings {...props} user={this.props.user}/> :
                                <Redirect to={'/sign-in'}/>
                        )}/>

                        <Route render={() => (
                            <Error404/>
                        )}/>
                    </Switch>
                </Layout>
            </BrowserRouter>
        );
    }
}

Router.propTypes = {
    user: PropTypes.object,
    onDarkThemeToggle: PropTypes.func.isRequired,
};

Router.defaultProps = {
    user: null,
};

export default translate()(Router);
