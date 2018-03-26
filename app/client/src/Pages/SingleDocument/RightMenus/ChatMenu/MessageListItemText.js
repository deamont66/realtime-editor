import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import withStyles from 'material-ui/styles/withStyles';

import Tooltip from 'material-ui/Tooltip';
import Typography from 'material-ui/Typography';

const styles = theme => ({
    root: {
        flex: '1 1 auto',
        padding: '0 16px',
        minWidth: 0
    },
    header: {
        fontWeight: 500,
    },
    small: {
        display: 'inline-block',
        paddingLeft: theme.spacing.unit / 2,
        fontWeight: 400,
        color: theme.palette.text.hint
    },
    message: {}
});

class MessageListItemText extends React.Component {

    render() {
        const {classes} = this.props;
        const dateMoment = moment(this.props.date);

        return (
            <div className={classes.root}>
                <Typography component={'div'} className={classes.header}>
                    {this.props.username}
                    <Tooltip title={dateMoment.format('llll')} placement={'top'}>
                        <span className={classes.small}> {dateMoment.fromNow()}</span>
                    </Tooltip>
                </Typography>
                <Typography className={classes.message}>{this.props.message}</Typography>
            </div>
        );
    }
}

MessageListItemText.propTypes = {
    username: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired
};

export default withStyles(styles)(MessageListItemText);
