import React from 'react';
import {translate} from 'react-i18next';
import withStyles from 'material-ui/styles/withStyles';

import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';

import MetaTags from '../../Components/MetaTags';

const styles = theme => ({
    root: theme.mixins.gutters({
        paddingTop: theme.typography.pxToRem(16),
        paddingBottom: theme.typography.pxToRem(16),
        marginTop: theme.typography.pxToRem(theme.spacing.unit * 3),
        maxWidth: theme.typography.pxToRem(450),
        marginLeft: 'auto',
        marginRight: 'auto',
    }),
});

const Error404 = (props) => {
    return (
        <Paper elevation={4} className={props.classes.root}>
            <MetaTags title={props.t('error.not_found')}/>
            <Typography align={'center'}>{props.t('error.not_found')}</Typography>
        </Paper>
    );
};

export default withStyles(styles)(translate()(Error404));
