import React from 'react';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import axios from '../../../Utils/Axios';

import DocumentRightsEnum from '../../../Utils/DocumentRightsEnum';


class ShareMenuIcon extends React.Component {

    render() {
        return (
            <div className={ClassNames('Comp-ShareMenuIcon menu-icon', {
                active: this.props.active
            })}>
                <a href="#share" title="Share" onClick={(evt) => {
                    evt.preventDefault();
                    this.props.onClick();
                }}>
                    <FontAwesomeIcon icon="share-square"/>
                    <span className="sr-only">Share</span>
                </a>
            </div>
        );
    }
}

ShareMenuIcon.propTypes = {
    onClick: PropTypes.func.isRequired,
    active: PropTypes.bool.isRequired
};

ShareMenuIcon.defaultProps = {
    onClick: () => {
    },
    active: false
};

class ShareMenu extends React.Component {

    constructor() {
        super();

        this.state = {
            rights: null
        }
    }

    componentDidMount() {
        this.loadRights();
    }

    loadRights() {
        axios.get('/document/')
    }

    handleLinkRightsChange() {

    }

    handleChangeUserRights(username, value) {

    }

    handleRemoveUserRights(username) {

    }

    render() {
        return (
            <div className="Comp-ShareMenu">
                {this.state.rights === null && <p>Loading...</p>}
                {this.state.rights !== null && <div>
                    <input type="text" readOnly={true} value={window.location}/>
                    <select onChange={this.handleLinkRightsChange.bind(this)} value={this.state.rights.link}>
                        {DocumentRightsEnum.map((setting, index) => {
                            return (
                                <option name={index}>{setting.title}</option>
                            );
                        })}
                    </select>
                    <button>Copy</button>
                </div>}

                <button onClick={this.props.onClose}>Close</button>
            </div>
        );
    }
}

ShareMenu.propTypes = {
    onClose: PropTypes.func.isRequired,
    documentId: PropTypes.string.isRequired,
};

ShareMenu.defaultProps = {
    onClose: () => {
    }
};

export default {
    menu: ShareMenu,
    icon: ShareMenuIcon
};
