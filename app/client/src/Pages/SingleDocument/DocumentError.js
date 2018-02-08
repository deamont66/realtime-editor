import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

class DocumentError extends React.Component {

    render() {
        return (
            <div className="Comp-DocumentError">
                <div className="error-message">
                    {this.props.error.message}
                </div>
                <Link to={'/'}>Go Home</Link>
            </div>
        );
    }
}

DocumentError.propTypes = {
    error: PropTypes.object.isRequired
};

export default DocumentError;
