import React from 'react';
import {Link} from 'react-router-dom';
import UserStore from "../../Stores/UserStore";

class SignIn extends React.Component {

    constructor() {
        super();

        this.state = {
            username: '',
            password: '',

            message: null
        }
    }


    handleSumbit(evt) {
        evt.preventDefault();
        this.setState({
            message: null
        });

        UserStore.singIn(this.state.username, this.state.password).then((user) => {
            this.props.history.push('/');
        }).catch((error) => {
            this.setState({
                message: error.response.data.message
            });
        });
    }

    render() {
        return (
            <div className="Comp-SignIn container">
                <div className="row">
                    <div className="col">
                        <p/>
                        <h1>Sign In</h1>
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

                            {this.state.message !== null && <div className="alert alert-danger" role="alert">
                                {this.state.message}
                            </div>}

                            <p><Link to="/forgot-password">I forgot my password.</Link></p>
                            <p><Link to="/sign-up">I don't have an account yet.</Link></p>

                            <button type="submit" className="btn btn-primary">Sign In</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

SignIn.propTypes = {};

export default SignIn;
