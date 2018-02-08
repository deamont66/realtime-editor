import React from 'react';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import PropTypes from 'prop-types';
import SignIn from "./SignIn/SignIn";
import SignUp from "./SignUp/SignUp";
import Header from "./Components/Header";
import SingleDocument from "./SingleDocument/SingleDocument";

class Router extends React.Component {

    render() {
        return (
            <div className="Comp-Router">
                <BrowserRouter>
                    <div>
                        <Header user={this.props.user}/>
                        <Switch>
                            {this.props.user === null &&
                            <Route exact path={'/sign-up'} render={(props) => (<SignUp {...props}/>)}/>}
                            {this.props.user === null &&
                            <Route exact path={'/sign-in'} render={(props) => (<SignIn {...props}/>)}/>}
                            {this.props.user === null &&
                            <Route exact path={'/forgot-password'} render={(props) => (
                                <p>Forgot password form</p>//<ForgotPassword {...props}/>
                            )}/>}

                            <Route exact path={'/editor'} render={(props) => (
                                <SingleDocument {...props} user={{}}/>
                            )}/>

                            {this.props.user === null && <Redirect to={'/sign-in'}/>}

                            <Route exact path={'/'} render={(props) => (
                                <p>Homepage</p>//<Homepage {...props}/>
                            )}/>

                            <Route exact path={'/documents'} render={(props) => (
                                <p>My document list</p>//<Editor {...props} user={this.props.user}/>
                            )}/>

                            <Route path={'/documents/shared'} render={(props) => (
                                <p>Shared with me document list</p>//<Editor {...props} user={this.props.user}/>
                            )}/>

                            <Route path={'/documents/history'} render={(props) => (
                                <p>My last document list</p>//<Editor {...props} user={this.props.user}/>
                            )}/>

                            <Route path={'/documents/:documentId'} render={(props) => (
                                <SingleDocument {...props} user={this.props.user}/>
                            )}/>

                            <Route render={(props) => (
                                <p>404 Not found</p>//<NotFoundPage {...props}/>
                            )}/>
                        </Switch>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

Router.propTypes = {
    user: PropTypes.object,
};

Router.defaultProps = {
    user: null,
};

export default Router;
