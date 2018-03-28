import React from 'react';
import {translate} from 'react-i18next';
import withStyles from 'material-ui/styles/withStyles';

import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Tooltip from 'material-ui/Tooltip';
import IconButton from 'material-ui/IconButton';

import CTU from "../../Components/Icons/CTU";
import Google from "../../Components/Icons/Google";
import Facebook from "../../Components/Icons/Facebook";
import Twitter from "../../Components/Icons/Twitter";

const styles = theme => ({

    socialWrapper: {
        margin: theme.spacing.unit,
        [theme.breakpoints.up('sm')]: {
            margin: theme.spacing.unit * 2,
        },
        marginTop: 0,
        marginBottom: theme.spacing.unit,
    },
    socialIcon: {
        height: 'auto'
    }
});

class SocialButtons extends React.Component {

    render() {
        const {classes, t} = this.props;

        return (
            <Grid item xs={12}>
                <Typography component="div" align={'center'}>
                    <Tooltip title={t('signIn.CTU')} placement={'right'}>
                        <IconButton href={'/api/auth/ctu'} size="large" variant="raised" className={classes.socialWrapper}>
                            <CTU className={classes.socialIcon}/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t('signIn.google')} placement={'right'}>
                        <IconButton href={'/api/auth/google'} size="large" variant="raised" className={classes.socialWrapper}>
                            <Google className={classes.socialIcon}/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t('signIn.facebook')} placement={'right'}>
                        <IconButton href={'/api/auth/facebook'} size="large" variant="raised" className={classes.socialWrapper}>
                            <Facebook className={classes.socialIcon}/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t('signIn.twitter')} placement={'right'}>
                        <IconButton href={'/api/auth/twitter'} size="large" variant="raised" className={classes.socialWrapper}>
                            <Twitter className={classes.socialIcon}/>
                        </IconButton>
                    </Tooltip>
                </Typography>
            </Grid>
        );
    }
}

SocialButtons.propTypes = {};

export default withStyles(styles)(translate()(SocialButtons));
