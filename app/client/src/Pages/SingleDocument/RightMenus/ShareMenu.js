import React from 'react';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';


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

    render() {
        return (
            <div className="Comp-ShareMenu">
                Share Menu
                <button onClick={this.props.onClose}>Close</button>
            </div>
        );
    }
}

ShareMenu.propTypes = {
    onClose: PropTypes.func.isRequired,
};

ShareMenu.defaultProps = {
    onClose: () => {
    }
};

export default {
    menu: ShareMenu,
    icon: ShareMenuIcon
};
