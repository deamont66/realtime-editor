import React from 'react';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { translate } from 'react-i18next';

import {withStyles} from 'material-ui/styles/index';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import Menu, {MenuItem} from 'material-ui/Menu';
import Tooltip from 'material-ui/Tooltip';
import Hidden from 'material-ui/Hidden';

import MenuIcon from 'material-ui-icons/Menu';
import AccountCircle from 'material-ui-icons/AccountCircle';
import Add from 'material-ui-icons/Add';

import NavLinkMenuItem from "../../Components/NavLinkMenuItem";
import UserStore from "../../Stores/UserStore";
import axios from "../../Utils/Axios";

const styles = theme => ({
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    hide: {
        display: 'none',
    },
    title: {
        flex: 1,
        cursor: 'pointer'
    },
    createButton: {
        marginRight: theme.typography.pxToRem(theme.spacing.unit)
    }
});


class AppBarMenu extends React.Component {

    state = {
        anchorEl: null,
    };

    handleMenu = event => {
        this.setState({anchorEl: event.currentTarget});
    };

    handleClose = () => {
        this.setState({anchorEl: null});
    };

    createNewDocument = (evt) => {
        evt.preventDefault();

        axios.post('/document/').then((res) => {
            this.props.history.push('/document/' + res.data.document);
        }).catch((err) => {
            console.log(err);
        });
    };

    render() {
        const {classes, isOpen, t} = this.props;

        return (
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={this.props.onDrawerToggle}
                    className={classNames(classes.menuButton, isOpen && classes.hide)}
                >
                    <MenuIcon/>
                </IconButton>
                <Typography className={classes.title} component="p"
                            variant="title" color="inherit" noWrap onClick={() => {
                    this.props.history.push('/')
                }}>{t('appBar.title')}</Typography>

                {this.props.user &&
                <Button variant="raised" color="secondary" size="small" className={classes.createButton}
                        onClick={this.createNewDocument}>
                    <Hidden smDown>{t('appBar.create_button')}</Hidden>
                    <Hidden mdUp><Add/></Hidden>
                </Button>}

                {!this.props.user && <Button color="inherit" onClick={() => {
                    this.props.history.push('/sign-in')
                }}>{t('signIn.submit_button')}</Button>}
                {this.props.user && <div>
                    <Tooltip id="tooltip-icon" title={t('appBar.logged_in_as', {username: this.props.user.username})}>
                        <IconButton
                            aria-owns={Boolean(this.state.anchorEl) ? 'menu-appbar' : null}
                            aria-haspopup="true"
                            aria-label={t('appBar.logged_in_as', {username: this.props.user.username})}
                            aria-describedby="tooltip-icon"
                            onClick={this.handleMenu}
                            color="inherit"
                        >
                            <AccountCircle/>
                        </IconButton>
                    </Tooltip>
                    <Menu
                        id="menu-appbar"
                        anchorEl={this.state.anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(this.state.anchorEl)}
                        onClose={this.handleClose}
                    >
                        <NavLinkMenuItem onClick={this.handleClose} to={'/settings'} exact>{t('appBar.settings_button')}</NavLinkMenuItem>
                        <MenuItem onClick={() => UserStore.logOut()}>{t('appBar.logout_button')}</MenuItem>
                    </Menu>
                </div>}
            </Toolbar>
        );
    }
}

AppBarMenu.propTypes = {
    onDrawerToggle: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    user: PropTypes.object,
};

export default translate()(withRouter(withStyles(styles)(AppBarMenu)));

