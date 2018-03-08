import React from 'react';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import EditorModes from '../../../Utils/EditorModes';
import EditorThemes from '../../../Utils/EditorThemes';
import DocumentSettingsForm from "../../Settings/DefaultDocumentSettings/DocumentSettingsForm";

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
                <DocumentSettingsForm settings={this.props.settings} onSettingsChange={this.props.onSettingsChange}/>
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











