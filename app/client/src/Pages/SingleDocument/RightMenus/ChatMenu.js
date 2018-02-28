import React from 'react';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

class ChatMenuIcon extends React.Component {

    render() {
        return (
            <div className={ClassNames('Comp-ShareMenuIcon menu-icon', {
                active: this.props.active
            })}>
                <a href="#chat" title="Chat" onClick={(evt) => {
                    evt.preventDefault();
                    this.props.onClick();
                }}>
                    <FontAwesomeIcon icon="comments"/>
                    <span className="sr-only">Comments</span>
                </a>
            </div>
        );
    }
}

ChatMenuIcon.propTypes = {
    onClick: PropTypes.func.isRequired,
    active: PropTypes.bool.isRequired
};

ChatMenuIcon.defaultProps = {
    onClick: () => {},
    active: false
};

class ChatMenu extends React.Component {

    render() {
        return (
            <div className="Comp-ShareMenu">
                Chat Menu
                <button onClick={this.props.onClose}>Close</button>
            </div>
        );
    }
}

ChatMenu.propTypes = {
    onClose: PropTypes.func.isRequired,
};

ChatMenu.defaultProps = {
    onClose: () => {}
};

export default {
    menu: ChatMenu,
    icon: ChatMenuIcon
};
