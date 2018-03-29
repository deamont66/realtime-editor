import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {withStyles} from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Hidden from 'material-ui/Hidden';

import DrawerMenu from './DrawerMenu';
import AppBarMenu from './AppBarMenu';
import EUCookiesSnackbar from './EUCookiesSnackbar';

const drawerWidth = 240;

const styles = theme => ({
    root: {
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        width: '100%',
        minHeight: '100vh',
    },
    appBar: {
        position: 'absolute',
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        [theme.breakpoints.up('md')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: drawerWidth,
        },
    },
    navIconHide: {
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
        height: '100%',
        [theme.breakpoints.up('md')]: {
            position: 'relative',
        },
    },
    content: {
        flexGrow: 1,
        maxWidth: '100%',
        paddingTop: theme.spacing.unit,
        backgroundColor: theme.palette.background.default,
        [theme.breakpoints.up('md')]: {
            padding: theme.spacing.unit * 3,
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: -drawerWidth,
        },
    },
    contentShift: {
        [theme.breakpoints.up('md')]: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        },
        overflow: 'auto'
    },
});

class Layout extends React.Component {
    constructor() {
        super();

        this.state = {
            open: false,
        }
    }

    handleDrawerToggle = () => {
        this.setState({open: !this.state.open});
    };

    render() {
        const drawerContent = (<DrawerMenu onDrawerToggle={this.handleDrawerToggle} onDarkThemeToggle={this.props.onDarkThemeToggle}/>);

        return (
            <div className={this.props.classes.root}>
                <AppBar className={classNames(this.props.classes.appBar, {
                    [this.props.classes.appBarShift]: this.state.open,
                })}>
                    <AppBarMenu isOpen={this.state.open} user={this.props.user}
                                onDrawerToggle={this.handleDrawerToggle}/>
                </AppBar>
                <Hidden mdUp>
                    <Drawer
                        variant="temporary"
                        anchor={this.props.theme.direction === 'rtl' ? 'right' : 'left'}
                        open={this.state.open}
                        onClose={this.handleDrawerToggle}
                        classes={{
                            paper: this.props.classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {drawerContent}
                    </Drawer>
                </Hidden>
                <Hidden smDown>
                    <Drawer
                        variant="persistent"
                        open={this.state.open}
                        classes={{
                            paper: this.props.classes.drawerPaper,
                        }}
                    >
                        {drawerContent}
                    </Drawer>
                </Hidden>
                <main className={classNames(this.props.classes.content, {
                    [this.props.classes.contentShift]: this.state.open
                })}>
                    <div className={this.props.classes.toolbar}/>
                    {this.props.children}
                </main>
                <EUCookiesSnackbar/>
            </div>
        );
    }
}

Layout.propTypes = {
    children: PropTypes.node.isRequired,
    onDarkThemeToggle: PropTypes.func.isRequired,
    user: PropTypes.object,
};

export default withStyles(styles, {withTheme: true})(Layout);
