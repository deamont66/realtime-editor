import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

import withStyles from 'material-ui/styles/withStyles';

const styles = theme => ({
    link: {
        color: theme.palette.secondary.main
    },
});

class MaterialLink extends React.Component {
    
    render() {
        return (
            <Link to={this.props.to} className={this.props.classes.link}>
                {this.props.children}
            </Link>
        );
    }
}

MaterialLink.propTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
};

MaterialLink.defaultProps = {
    onClick: () => {},
};

export default withStyles(styles)(MaterialLink);
