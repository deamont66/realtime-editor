import React, {Component} from 'react';

import Router from './Pages/Router';
import UserStore from './Stores/UserStore';

import './App.css';
import Loading from "./Pages/Components/Loading";

import fontAwesome from '@fortawesome/fontawesome';
import brands from '@fortawesome/fontawesome-free-brands';
import solids from '@fortawesome/fontawesome-free-solid';

fontAwesome.library.add(brands, solids);

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
        UserStore.on('value', this.handleUserChange);
        this.userCheckInterval = setInterval(() => {
            UserStore.checkLoggedIn();
        }, 10 * 60 * 1000);
        UserStore.checkLoggedIn().then(() => {
            this.setState({loading: false});
        });
    }

    componentWillUnmount() {
        UserStore.off('value', this.handleUserChange);
        clearInterval(this.userCheckInterval);
    }

    handleUserChange(user) {
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
