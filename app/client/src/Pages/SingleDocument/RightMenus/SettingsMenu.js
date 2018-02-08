import React from 'react';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';


class SettingsMenuIcon extends React.Component {

    render() {
        return (
            <div className={ClassNames('Comp-ShareMenuIcon menu-icon', {
                active: this.props.active
            })}>
                <a href="#settings" title="Settings" onClick={(evt) => {
                    evt.preventDefault();
                    this.props.onClick();
                }}>
                    <i className="fas fa-cog"/>
                    <span className="sr-only">Settings</span>
                </a>
            </div>
        );
    }
}

SettingsMenuIcon.propTypes = {
    onClick: PropTypes.func.isRequired,
    active: PropTypes.bool.isRequired
};

SettingsMenuIcon.defaultProps = {
    onClick: () => {},
    active: false
};

class SettingsMenu extends React.Component {

    render() {
        return (
            <div className="Comp-ShareMenu">
                Settings Menu
                <button onClick={this.props.onClose}>Close</button>
            </div>
        );
    }
}

SettingsMenu.propTypes = {
    onClose: PropTypes.func.isRequired,
};

SettingsMenu.defaultProps = {
    onClose: () => {}
};

export default {
    menu: SettingsMenu,
    icon: SettingsMenuIcon
};
