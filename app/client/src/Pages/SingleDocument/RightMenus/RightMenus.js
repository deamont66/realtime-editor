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

        this.state = {
            activeMenu: 1,
        };

        this.menus = [
            ShareMenu, ChatMenu, SettingsMenu
        ];
    }

    handleMenuClose() {
        this.setState({
           activeMenu: -1
        });
    }

    handleMenuChange(menuIndex) {
        this.setState((oldState) => {
            return {
                activeMenu: (oldState.activeMenu === menuIndex) ? -1 : menuIndex
            }
        });
    }

    render() {

        return (
            <div className="Comp-RightMenus">
                <div className="menu-icons">
                    {this.menus.map((components, index) => {
                        return React.createElement(components.icon, {
                            onClick: this.handleMenuChange.bind(this, index),
                            active: this.state.activeMenu === index,
                            key: index
                        });
                    })}
                </div>
                <div className={ClassNames('menu-content', {
                    'active': this.state.activeMenu !== -1
                })}>
                    {this.state.activeMenu !== -1 && React.createElement(this.menus[this.state.activeMenu].menu, {
                        ...this.props,
                        onClose: this.handleMenuClose.bind(this),
                    })}
                </div>
            </div>
        );
    }
}

RightMenus.propTypes = {
};

export default RightMenus;
