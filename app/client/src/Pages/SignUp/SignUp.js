import React from 'react';
import {Link} from 'react-router-dom';
import UserStore from "../../Stores/UserStore";

class SignUp extends React.Component {

    constructor() {
        super();

        this.state = {
            username: '',
            password: '',
            name: '',

            message: null
        }
    }


    handleSumbit(evt) {
        evt.preventDefault();

        let message = null;
        if(!this.state.username) {
            message = 'Field username is required'
        } else if(!this.state.password) {
            message = 'Field password is required'
        } else if(!this.state.name) {
            message = 'Field name is required'
        }

        this.setState({
            message: message
        });

        if(message !== null) return;

        UserStore.singUp(this.state.username, this.state.password, this.state.name).then((user) => {
            this.props.history.push('/sign-in');
        }).catch((error) => {
            this.setState({
                message: error.response.data.message
            });
        });
    }

    render() {
        return (
            <div className="Comp-SignUp container">
                <div className="row">
                    <div className="col">
                        <p/>
                        <h1>Sign Up</h1>
                        <form onSubmit={this.handleSumbit.bind(this)}>
                            <div className="form-group">
                                <label htmlFor="usernameInput">Username</label>
                                <input type="text" className="form-control" id="usernameInput"
                                       placeholder="Enter username" value={this.state.username} required
                                       onChange={(evt) => this.setState({username: evt.target.value})}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="passwordInput">Password</label>
                                <input type="password" className="form-control" id="passwordInput"
                                       placeholder="Enter password" value={this.state.password} required
                                       onChange={(evt) => this.setState({password: evt.target.value})}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="nameInput">Name</label>
                                <input type="name" className="form-control" id="nameInput"
                                       placeholder="Enter name" value={this.state.name} required
                                       onChange={(evt) => this.setState({name: evt.target.value})}/>
                            </div>

                            {this.state.message !== null && <div className="alert alert-danger" role="alert">
                                {this.state.message}
                            </div>}

                            {/*<p><Link to="/forgot-password">I forgot my password.</Link></p>*/}
                            <p><Link to="/sign-in">I already have an account.</Link></p>

                            <button type="submit" className="btn btn-primary">Sign Up</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

SignUp.propTypes = {};

export default SignUp;
