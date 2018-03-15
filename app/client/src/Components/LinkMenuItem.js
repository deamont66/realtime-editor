import React from 'react';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';

import {MenuItem} from 'material-ui/Menu'

class LinkMenuItem extends React.Component {

    handleClick = (evt) => {
        this.props.history.push(this.props.to);
        this.props.onClick(evt);
    };

    render() {
        return (
            <MenuItem onClick={this.handleClick}
                      component={this.props.component} selected={this.props.selected}>
                {this.props.children}
            </MenuItem>
        );
    }
}

LinkMenuItem.propTypes = {
    to: PropTypes.string.isRequired,

    children: PropTypes.node,
    component: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
    ]).isRequired,
    selected: PropTypes.bool.isRequired,
};

LinkMenuItem.defaultProps = {
    component: 'li',
    selected: false,
};

export default withRouter(LinkMenuItem);
