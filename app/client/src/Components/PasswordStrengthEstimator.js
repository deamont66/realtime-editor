import React from 'react';
import PropsTypes from 'prop-types';
import {translate} from 'react-i18next';
import moment from 'moment';

export function estimateStrength(password, inputs = []) {
    return new Promise(resolve => {
        require.ensure([], () => {
            resolve(require('zxcvbn')(password, inputs));
        });
    });
}


class PasswordStrengthEstimator extends React.Component {

    constructor() {
        super();

        this.state = {
            speed: 0
        };
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.password) {
            estimateStrength(nextProps.password, nextProps.inputs).then((res) => {
                this.setState({speed: res.crack_times_seconds.online_no_throttling_10_per_second});
            });
        }
    }

    render() {
        if(this.props.password.length === 0) {
            return null;
        }

        const duration = moment.duration(this.state.speed, "seconds");
        if (duration.years() > 200) {
            return this.props.t('password_estimator.in_centuries');
        }
        return this.props.t('password_estimator.in_param', {param: duration.humanize()});
    }
}

PasswordStrengthEstimator.propTypes = {
    password: PropsTypes.string.isRequired,
    inputs: PropsTypes.arrayOf(PropsTypes.string).isRequired,
};

PasswordStrengthEstimator.defaultProps = {
    inputs: []
};

export default translate()(PasswordStrengthEstimator);