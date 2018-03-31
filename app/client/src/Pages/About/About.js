import React from 'react';
import {translate} from 'react-i18next';
import withStyles from 'material-ui/styles/withStyles';

import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';

import MetaTags from '../../Components/MetaTags';
import FileIcon from '../../Components/Icons/FileIcon';
import Licences from './Licences';

const styles = theme => ({
    root: theme.mixins.gutters({
        paddingTop: theme.typography.pxToRem(theme.spacing.unit * 2),
        paddingBottom: theme.typography.pxToRem(theme.spacing.unit * 2),
        marginTop: theme.typography.pxToRem(theme.spacing.unit * 3),
        maxWidth: theme.typography.pxToRem(750),
        marginLeft: 'auto',
        marginRight: 'auto',
    }),
    image: {
        maxWidth: '100%',
        width: 200,
        height: 'auto',
        marginBottom: theme.spacing.unit
    }
});

const About = (props) => {
    return (
        <Paper elevation={4} className={props.classes.root}>
            <MetaTags title={props.t('app.titles.about')}/>

            <Typography align={'center'}><FileIcon className={props.classes.image}/></Typography>

            <Typography variant={'headline'} align={'center'} paragraph>{props.t('about.headline')}</Typography>
            <Typography align={'center'} paragraph>{props.t('about.text')}</Typography>

            <Licences/>

        </Paper>
    );
};

export default withStyles(styles)(translate()(About));
