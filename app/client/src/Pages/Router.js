import React from 'react';
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

class Router extends React.Component {

    render() {
        return (
            <div className="Comp-Router">
                <BrowserRouter>
                    <div>
                        <Layout user={this.props.user} onDarkThemeToggle={this.props.onDarkThemeToggle}>
                            <Switch>
                                <Route exact path={'/sign-up'} render={(props) => (
                                    this.props.user === null ? <SignUp {...props}/> : <Redirect to={'/'}/>)}/>

                                <Route exact path={'/sign-in'} render={(props) => (
                                    this.props.user === null ? <SignIn {...props}/> : <Redirect to={'/'}/>)}/>

                                <Route exact path={'/forgot-password'} render={(props) => (
                                    this.props.user === null ? <p>Forgot password form</p> : <Redirect to={'/'}/>//<ForgotPassword {...props}/>
                                )}/>

                                <Route exact path={'/'} render={(props) => (
                                    <p>Homepage</p>//<Homepage {...props}/>
                                )}/>

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
                                    this.props.user !== null ? <SingleDocument {...props} user={this.props.user}/> :
                                        <Redirect to={'/sign-in'}/>
                                )}/>


                                <Route path={'/settings'} render={(props) => (
                                    this.props.user !== null ? <Settings {...props} user={this.props.user}/> :
                                        <Redirect to={'/sign-in'}/>
                                )}/>

                                <Route render={(props) => (
                                    <p>404 Not found</p>//<NotFoundPage {...props}/>
                                )}/>
                            </Switch>
                        </Layout>
                    </div>
                </BrowserRouter>
            </div>
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

export default Router;
