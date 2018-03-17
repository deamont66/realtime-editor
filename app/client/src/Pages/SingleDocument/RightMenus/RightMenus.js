import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import ShareMenu from "./ShareMenu";
import './RightMenus.css';
import ChatMenu from "./ChatMenu";
import SettingsMenu from "./SettingsMenu";

class RightMenus extends React.Component {

    constructor() {
        super();

        this.menus = {
            share: ShareMenu,
            chat: ChatMenu,
            settings: SettingsMenu
        };
    }

    handleMenuClose() {
        this.props.toggleMenu(null);
    }

    handleMenuChange(menu) {
        this.props.toggleMenu(menu);
    }

    render() {
        const {menu} = this.props;

        return (
            <div className="Comp-RightMenus">
                <div className={ClassNames('menu-content', {
                    'active': menu !== null
                })}>
                    {menu !== null && React.createElement(this.menus[menu].menu, {
                        ...this.props,
                        onClose: this.handleMenuClose.bind(this),
                    })}
                </div>
            </div>
        );
    }
}

RightMenus.propTypes = {
    menu: PropTypes.string,
    toggleMenu: PropTypes.func.isRequired
};

export default RightMenus;
