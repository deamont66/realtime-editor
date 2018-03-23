import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';
import withStyles from 'material-ui/styles/withStyles';

import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';

import Close from 'material-ui-icons/Close';

import ShareMenu from "./ShareMenu/ShareMenu";
import ChatMenu from "./ChatMenu";
import SettingsMenu from "./SettingsMenu/SettingsMenu";

const MENUS = {
    share: ShareMenu,
    chat: ChatMenu,
    settings: SettingsMenu
};

const styles = theme => ({
    root: {
        flexGrow: 0,
        borderLeft: `1px solid ${theme.palette.grey[300]}`,
        padding: theme.spacing.unit,
        paddingTop: theme.spacing.unit * 2,
        position: 'relative',
        maxHeight: 'calc(100vh - 64px - 72px)',
        overflow: 'auto',
        minWidth: 'min-content'
    },
    rootNonActive: {
        padding: 0,
        borderLeft: 0
    },
    closeButton: {
        position: 'absolute',
        top: 0,
        right: theme.spacing.unit,
        width: 25,
        Height: 25,
        zIndex: 20,
    },
    contentActive: {
        [theme.breakpoints.up('sm')]: {
            width: 300
        }
    }
});

class RightMenus extends React.Component {

    handleMenuClose = () => {
        this.props.toggleMenu(null);
    };

    handleMenuChange = (menu) => {
        this.props.toggleMenu(menu);
    };

    render() {
        const {classes, menu, ...childProps} = this.props;

        return (
            <Grid className={ClassNames(classes.root, {
                [classes.rootNonActive]: menu === null
            })} xs={12} sm item>
                {menu !== null && <IconButton className={classes.closeButton} onClick={this.handleMenuClose}>
                    <Close/>
                </IconButton>}
                <div className={ClassNames({
                    [classes.contentActive]: menu !== null
                })}>
                    {menu !== null && React.createElement(MENUS[menu], {
                        ...childProps,
                        onClose: this.handleMenuClose.bind(this),
                    })}
                </div>
            </Grid>
        );
    }
}

RightMenus.propTypes = {
    menu: PropTypes.string,
    toggleMenu: PropTypes.func.isRequired
};

export default withStyles(styles)(RightMenus);
