import React from 'react';
import PropTypes from 'prop-types';

import axios from '../../../Utils/Axios';
import UserStore from "../../../Stores/UserStore";

class AccountSettings extends React.Component {


    constructor(props) {
        super(props);

        this.state = this.getInitialState(props);
    }

    getInitialState(props) {
        return {
            username: props.user.username,
            email: props.user.email,

            password: '',
            newPassword: '',
            newPassword2: ''
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState(this.getInitialState(newProps));
    }

    handleUsernameChange(evt) {
        this.setState({
            username: evt.target.value
        });
    }

    handleEmailChange(evt) {
        this.setState({
            email: evt.target.value
        });
    }

    handlePasswordChange(evt) {
        this.setState({
            password: evt.target.value
        });
    }

    handleNewPasswordChange(evt) {
        this.setState({
            newPassword: evt.target.value
        });
    }

    handleNewPassword2Change(evt) {
        this.setState({
            newPassword2: evt.target.value
        });
    }

    handleSubmit(evt) {
        evt.preventDefault();

        const data = {};
        let isEmpty = true;
        let errorMessage = null;
        if (this.state.username !== this.props.user.username) {
            data.username = this.state.username;
            isEmpty = false;
        }
        if (this.state.email !== this.props.user.email) {
            // eslint-disable-next-line no-useless-escape
            if((!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.state.email))) {
                errorMessage = 'Field email has to be valid email address';
            } else {
                data.email = this.state.email;
                isEmpty = false;
            }
        }
        if (this.state.newPassword) {
            if(this.state.newPassword !== this.state.newPassword2) {
                errorMessage = 'Fields with new password must match';
            }
            data.newPassword = this.state.newPassword;
            isEmpty = false;
        }
        if(!this.state.password) {
            errorMessage = 'Fields password is required';
        } else {
            data.password = this.state.password;
        }

        if(isEmpty || errorMessage) {
            console.log(errorMessage || 'no changes were made');
            return;
        }

        axios.put('/user', data).then(() => {
            UserStore.checkLoggedIn();
            console.log('changed');
        }).catch((err) => {
            console.log(err.response.data.message);
        });
    }

    render() {
        return (
            <div className="Comp-AccountSettings">
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <div>
                        <label htmlFor="username_input">Username</label>
                        <input id="username_input" type="text"
                               onChange={this.handleUsernameChange.bind(this)} value={this.state.username}/>
                    </div>
                    <hr/>
                    <div>
                        <label htmlFor="email_input">Email</label>
                        <input id="email_input" type="text"
                               onChange={this.handleEmailChange.bind(this)} value={this.state.email}/>
                    </div>
                    <hr/>
                    <div>
                        <label htmlFor="new_password_input">New Password</label>
                        <input id="new_password_input" type="password"
                               onChange={this.handleNewPasswordChange.bind(this)} value={this.state.newPassword}/>
                        <br/>
                        <label htmlFor="new_password2_input">New Password Again</label>
                        <input id="new_password2_input" type="password"
                               onChange={this.handleNewPassword2Change.bind(this)} value={this.state.newPassword2}/>
                    </div>
                    <hr/>
                    <label htmlFor="password_input">Password</label>
                    <input id="password_input" type="password"
                           onChange={this.handlePasswordChange.bind(this)} value={this.state.password}/>
                    <br/>
                    <button type="submit">Save changes</button>
                </form>
            </div>
        );
    }
}

AccountSettings.propTypes = {
    user: PropTypes.object.isRequired,
};

export default AccountSettings;
