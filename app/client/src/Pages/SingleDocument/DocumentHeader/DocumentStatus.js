import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';


const STATES = {
    disconnected: {
        text: "No connection",
        icon: "exclamation-triangle",
        spin: false,
        className: "text-warning"
    },
    synchronized: {
        text: "Synchronized",
        icon: "check",
        spin: false,
        className: "d-none"
    },
    synchronization: {
        text: "Pending synchronization",
        icon: "sync",
        spin: true,
        className: "text-secondary"
    },
};

class DocumentStatus extends React.Component {

    render() {
        let state = STATES.disconnected;
        if(!this.props.disconnected) {
            if(this.props.state === 'Synchronized') {
                state = STATES.synchronized;
            } else {
                state = STATES.synchronization;
            }
        }

        return (
            <div className="Comp-DocumentStatus">
                <span className={ClassNames(state.className)} title={state.text}>
                    <span className="text-small"><FontAwesomeIcon icon={state.icon} spin={state.spin}/> {state.text}</span>
                </span>
            </div>
        );
    }
}

DocumentStatus.propTypes = {
    disconnected: PropTypes.bool.isRequired,
    state: PropTypes.string.isRequired,
};

export default DocumentStatus;
