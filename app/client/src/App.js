import React, {Component} from 'react';

import Router from './Pages/Router';
import UserStore from './Stores/UserStore';

import './App.css';
import Loading from "./Pages/Components/Loading";

class App extends Component {

    constructor() {
        super();

        this.state = {
            user: null,
            loading: true,
        };

        this.handleUserChange = this.handleUserChange.bind(this);
    }

    componentDidMount() {
        UserStore.registerChangeListener(this.handleUserChange);
        this.userCheckInterval = setInterval(() => {
            UserStore.checkLoggedIn();
        }, 10 * 1000);
        UserStore.checkLoggedIn().then(() => {
            this.setState({loading: false});
        });
    }

    componentWillUnmount() {
        UserStore.removeChangeListener(this.handleUserChange);
        clearInterval(this.userCheckInterval);
    }

    handleUserChange(user) {
        console.log(user);
        this.setState({
            user: user
        });
    }

    render() {
        return (
            <div className="Comp-App">
                {this.state.loading && <Loading/>}
                {!this.state.loading && <Router user={this.state.user}/>}
            </div>
        );
    }
}

export default App;
