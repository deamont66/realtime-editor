import React from 'react';
import {matchPath, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';

import LinkMenuItem from './LinkMenuItem';

class NavLinkMenuItem extends React.Component {

    render() {
        const {to, exact, strict, ...passProps} = this.props;
        const match = matchPath(this.props.location.pathname, {path: to, exact: exact, strict: strict});
        return (
            <LinkMenuItem {...passProps} to={to} selected={this.props.selected || match !== null}/>
        );
    }
}

NavLinkMenuItem.propTypes = {
    to: PropTypes.string.isRequired,
    exact: PropTypes.bool.isRequired,
    strict: PropTypes.bool.isRequired,

    children: PropTypes.node,
    component: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
    ]).isRequired,
    selected: PropTypes.bool.isRequired,
};

NavLinkMenuItem.defaultProps = {
    component: 'li',
    selected: false,
    exact: false,
    strict: false
};

export default withRouter(NavLinkMenuItem);
