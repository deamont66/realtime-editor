import React, {Component} from 'react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import CssBaseline from 'material-ui/CssBaseline';

import primaryColor from 'material-ui/colors/indigo';
import secondaryColor from 'material-ui/colors/pink';

import Router from './Pages/Router';
import UserStore from './Stores/UserStore';

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
            theme: localStorage.getItem('theme') || 'light'
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
        const theme = this.state.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        this.setState({
            theme: theme
        });
    };

    render() {
        const theme = createMuiTheme({
            palette: {
                primary: primaryColor,
                secondary: secondaryColor,
                type: this.state.theme,
            },
        });

        return (
            <MuiThemeProvider theme={theme}>
                <CssBaseline/>
                {this.state.loading && <Loading/>}
                {!this.state.loading && <Router user={this.state.user} onDarkThemeToggle={this.handleDarkThemeToggle}/>}
            </MuiThemeProvider>
        );
    }
}

export default App;
