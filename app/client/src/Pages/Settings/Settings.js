import React from 'react';
import {Switch, Route, Redirect, NavLink} from 'react-router-dom';
import PropTypes from 'prop-types';
import AccountSettings from "./AccountSettings/AccountSettings";
import DefaultDocumentSettings from "./DefaultDocumentSettings/DefaultDocumentSettings";

class Settings extends React.Component {

    render() {
        return (
            <div className="Comp-Settings">
                <ul>
                    <li><NavLink to="/settings">Account</NavLink></li>
                    <li><NavLink to="/settings/document">Document settings</NavLink></li>
                </ul>

                <Switch>
                    <Route path={'/settings'} exact render={(props) => (
                        <AccountSettings {...props} user={this.props.user}/>
                    )}/>
                    <Route path={'/settings/document'} exact render={(props) => (
                        <DefaultDocumentSettings {...props} user={this.props.user}/>
                    )}/>

                    <Redirect to={'/settings'}/>
                </Switch>
            </div>
        );
    }
}

Settings.propTypes = {
    user: PropTypes.object.isRequired,
};

export default Settings;
