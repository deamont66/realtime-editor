import React from 'react';
import {translate} from 'react-i18next';
import PropTypes from 'prop-types';

import withStyles from 'material-ui/styles/withStyles';

import Tooltip from 'material-ui/Tooltip';
import Typography from 'material-ui/Typography';

import ErrorOutline from 'material-ui-icons/ErrorOutline';
import CloudDone from 'material-ui-icons/CloudDone';
import {CircularProgress} from 'material-ui/Progress';


const STATES = {
    disconnected: {
        text: "document_status.disconnected",
    },
    synchronized: {
        text: "document_status.synchronized",
    },
    synchronization: {
        text: "document_status.synchronization",
    },
};

const styles = theme => ({
    root: {
        color: theme.palette.text.hint,
        display: 'inline-block',
        marginLeft: theme.spacing.unit,
        lineHeight: '24px',
    },
    text: {
        verticalAlign: 'text-bottom',
        display: 'inline-block',
        paddingLeft: 5
    },
    icon: {
        verticalAlign: 'text-bottom',
    }
});

class DocumentStatus extends React.Component {

    render() {
        const {classes, t} = this.props;
        let state = STATES.disconnected;
        let icon = <ErrorOutline color={"error"} className={classes.icon}/>;
        if (!this.props.disconnected) {
            if (this.props.state === 'Synchronized') {
                state = STATES.synchronized;
                icon = <CloudDone className={classes.icon}/>;
            } else {
                state = STATES.synchronization;
                icon = <CircularProgress className={classes.icon} size={24} color={"secondary"}/>;
            }
        }

        return (
            <Tooltip title={t(state.text)} placement="right">
                <Typography className={classes.root} component={"div"}>
                    {icon} {/*<span className={classes.text}>{t(state.text)}</span>*/}
                </Typography>
            </Tooltip>
        );
    }
}

DocumentStatus.propTypes = {
    disconnected: PropTypes.bool.isRequired,
    state: PropTypes.string.isRequired,
};

export default translate()(withStyles(styles)(DocumentStatus));
