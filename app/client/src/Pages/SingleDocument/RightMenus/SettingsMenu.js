import React from 'react';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import EditorModes from '../../../Utils/EditorModes';
import EditorThemes from '../../../Utils/EditorThemes';

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
                    <FontAwesomeIcon icon="cog"/>
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

    constructor() {
        super();
    }


    render() {
        return (
            <div className="Comp-ShareMenu">

                <div className="form-group">
                    <label htmlFor="theme">Theme:</label>
                    <select id="theme" value={this.props.settings.theme} onChange={(event) => {
                        const value = event.target.options[event.target.selectedIndex].value;
                        this.props.onSettingsChange({theme: value});
                    }}>
                        {Object.keys(EditorThemes.all).map((themeKey) => {
                            return <option key={themeKey} value={themeKey}>{EditorThemes.all[themeKey]}</option>
                        })}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="mode">Mode (language):</label>
                    <select id="mode" value={this.props.settings.mode} onChange={(event) => {
                        const value = event.target.options[event.target.selectedIndex].value;
                        this.props.onSettingsChange({mode: value});
                    }}>
                        {Object.keys(EditorModes.all).map((modeKey) => {
                            return <option key={modeKey} value={modeKey}>{EditorModes.all[modeKey]}</option>
                        })}
                    </select>
                </div>

                <br/>
                <button onClick={this.props.onClose}>Close</button>
            </div>
        );
    }
}

SettingsMenu.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSettingsChange: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
};

SettingsMenu.defaultProps = {
    onClose: () => {}
};

export default {
    menu: SettingsMenu,
    icon: SettingsMenuIcon
};











