import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import './Loading.css';

class Loading extends React.Component {

    render() {
        return (
            <div className={ClassNames('Comp-Loading', {
                fullScreen: this.props.fullScreen
            })}>&nbsp;</div>
        );
    }
}

Loading.propTypes = {
    fullScreen: PropTypes.bool.isRequired,
};

Loading.defaultProps = {
    fullScreen: true
};

export default Loading;
