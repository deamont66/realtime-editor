import React from 'react';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import PropTypes from 'prop-types';
import SignIn from "./SignIn/SignIn";
import SignUp from "./SignUp/SignUp";
import Header from "./Components/Header";
import Editor from "./Editor/Editor";

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

                            {this.props.user === null && <Redirect to={'/sign-in'}/>}

                            <Route path={'/editor'} render={(props) => (
                                <Editor {...props} user={this.props.user}/>
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
