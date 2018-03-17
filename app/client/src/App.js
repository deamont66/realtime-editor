import React, {Component} from 'react';
import {I18nextProvider} from 'react-i18next';
import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles';
import CssBaseline from 'material-ui/CssBaseline';

import i18nInstance from './i18nInstance';

import primaryColor from 'material-ui/colors/indigo';
import secondaryColor from 'material-ui/colors/pink';

import Router from './Pages/Router';
import UserStore from './Stores/UserStore';

import Loading from "./Components/Loading";

class App extends Component {

    constructor() {
        super();

        this.state = {
            user: null,
            loading: true,
            translationLoading: true,
            theme: localStorage.getItem('theme') || 'light',
        };

        i18nInstance.on('loaded', this.handleTranslationLoaded);
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

    handleUserChange = user => {
        this.setState({
            user: user
        });
    };

    handleTranslationLoaded = () => {
        this.setState({
            translationLoading: false
        })
    };

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

        const isLoading = this.state.loading || this.state.translationLoading;
        return (
            <I18nextProvider i18n={i18nInstance}>
                <MuiThemeProvider theme={theme}>
                    <CssBaseline/>
                    {isLoading ? (
                        <Loading/>
                    ) : (
                        <Router user={this.state.user} onDarkThemeToggle={this.handleDarkThemeToggle}/>
                    )}
                </MuiThemeProvider>
            </I18nextProvider>
        );
    }
}

export default App;
