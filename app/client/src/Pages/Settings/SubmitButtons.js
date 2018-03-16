import React from 'react';
import {translate} from 'react-i18next';
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
        const {classes, t} = this.props;

        return (
            <Typography align="right">
                <Button type="button" className={classes.button}
                        onClick={() => this.props.onReset()}>
                    {t('settings.button.reset')}
                </Button>
                <Button type="submit" variant="raised" color="secondary" className={classes.button}>
                    {t('settings.button.submit')}
                </Button>
            </Typography>
        );
    }
}

SubmitButtons.propTypes = {
    onReset: PropTypes.func.isRequired,
};

export default translate()(withStyles(styles)(SubmitButtons));
