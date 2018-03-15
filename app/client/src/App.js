import React, {Component} from 'react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import red from 'material-ui/colors/red';
import lightBlue from 'material-ui/colors/lightBlue';

import Router from './Pages/Router';
import UserStore from './Stores/UserStore';

import './App.css';
import Loading from "./Components/Loading";

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
            theme: 'light'
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

    handleDarkThemeToggle = () => {
        this.setState((oldState) => ({
            theme: oldState.theme === 'light' ? 'dark' : 'light'
        }));
    };

    render() {
        const theme = createMuiTheme({
            palette: {
                primary: red,
                secondary: lightBlue,
                type: this.state.theme,
            },
        });

        return (
            <MuiThemeProvider theme={theme}>
                {this.state.loading && <Loading/>}
                {!this.state.loading && <Router user={this.state.user} onDarkThemeToggle={this.handleDarkThemeToggle}/>}
            </MuiThemeProvider>
        );
    }
}

export default App;
