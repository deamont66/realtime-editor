import React from 'react';
import PropTypes from 'prop-types';

import withStyles from 'material-ui/styles/withStyles';

import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

const styles = theme => ({
    button: {
        marginRight: theme.spacing.unit,
    }
});

class SubmitButtons extends React.Component {

    render() {
        const {classes} = this.props;

        return (
            <Typography align="right">
                <Button type="button" className={classes.button}
                        onClick={() => this.props.onReset()}>
                    Reset
                </Button>
                <Button type="submit" variant="raised" color="secondary" className={classes.button}>
                    Save changes
                </Button>
            </Typography>
        );
    }
}

SubmitButtons.propTypes = {
    onReset: PropTypes.func.isRequired,
};

export default withStyles(styles)(SubmitButtons);
