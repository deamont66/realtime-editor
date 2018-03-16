import React from 'react';
import {withRouter, matchPath} from 'react-router-dom';
import { translate } from 'react-i18next';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import {withStyles} from 'material-ui/styles';
import List, {ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Switch from 'material-ui/Switch';
import IconButton from 'material-ui/IconButton';

import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import ChevronRightIcon from 'material-ui-icons/ChevronRight';
import FolderOpen from 'material-ui-icons/FolderOpen';
import FolderShared from 'material-ui-icons/FolderShared';
import AccessTime from 'material-ui-icons/AccessTime';
import Info from 'material-ui-icons/Info';
import LightbulbOutline from 'material-ui-icons/LightbulbOutline';

const styles = theme => ({
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    selected: {
        backgroundColor: theme.palette.action.selected
    }
});

const NavLinkListItem = withRouter((props) => {
    const {classes, primary, secondary, to} = props;

    const match = matchPath(props.location.pathname, {path: to, exact: true});

    return (
        <ListItem button component={'a'} href={to}
                  onClick={(evt) => {
                      const event = evt || window.event;
                      if (!event.ctrlKey && !event.metaKey && event.which !== 2) {
                          evt.preventDefault();
                          props.onClick(to);
                      }
                  }}
                  className={classNames({[classes.selected]: match !== null})}>
            <ListItemIcon>
                {props.children}
            </ListItemIcon>
            <ListItemText
                primary={primary}
                secondary={secondary}
            />
        </ListItem>
    );
});

class DrawerMenu extends React.Component {

    handleNavLinkClick = (to) => {
        this.props.history.push(to);
    };

    render() {
        const {classes, theme, t} = this.props;

        return (
            <div>
                <div className={classes.drawerHeader}>
                    <IconButton onClick={this.props.onDrawerToggle}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                    </IconButton>
                </div>
                <Divider/>
                <Divider/>
                <List>
                    <NavLinkListItem to={'/document'}
                                     primary={t('drawerMenu.my_documents_item.primary')}
                                     secondary={t('drawerMenu.my_documents_item.secondary')}
                                     onClick={this.handleNavLinkClick}
                                     classes={classes}>
                        <FolderOpen/>
                    </NavLinkListItem>
                    <NavLinkListItem to={'/document/shared'}
                                     primary={t('drawerMenu.shared_documents_item.primary')}
                                     secondary={t('drawerMenu.shared_documents_item.secondary')}
                                     onClick={this.handleNavLinkClick}
                                     classes={classes}>
                        <FolderShared/>
                    </NavLinkListItem>
                    <NavLinkListItem to={'/document/history'}
                                     primary={t('drawerMenu.last_documents_item.primary')}
                                     secondary={t('drawerMenu.last_documents_item.secondary')}
                                     onClick={this.handleNavLinkClick}
                                     classes={classes}>
                        <AccessTime/>
                    </NavLinkListItem>
                </List>
                <Divider/>
                <List>
                    <NavLinkListItem to={'/about'}
                                     primary={t('drawerMenu.about_item.primary')}
                                     onClick={this.handleNavLinkClick}
                                     classes={classes}>
                        <Info/>
                    </NavLinkListItem>
                </List>
                <Divider/>
                <Divider/>
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <LightbulbOutline/>
                        </ListItemIcon>
                        <ListItemText primary={t('drawerMenu.dark_mode.primary')}/>
                        <ListItemSecondaryAction>
                            <Switch
                                aria-label={t('drawerMenu.dark_mode.aria_label')}
                                onChange={this.props.onDarkThemeToggle}
                                checked={theme.palette.type === 'dark'}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>
            </div>
        );
    }
}

DrawerMenu.propTypes = {
    onDrawerToggle: PropTypes.func.isRequired,
    onDarkThemeToggle: PropTypes.func.isRequired
};

export default translate()(withRouter(withStyles(styles, {withTheme: true})(DrawerMenu)));
