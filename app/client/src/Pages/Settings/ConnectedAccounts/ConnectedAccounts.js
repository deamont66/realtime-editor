import React from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import withStyles from 'material-ui/styles/withStyles';

import Typography from 'material-ui/Typography';
import Tooltip from 'material-ui/Tooltip';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import Button from 'material-ui/Button';

import Done from 'material-ui-icons/Done'

import CTU from '../../../Components/Icons/CTU';
import Google from '../../../Components/Icons/Google';
import Facebook from '../../../Components/Icons/Facebook';
import Twitter from '../../../Components/Icons/Twitter';

import UserStore from '../../../Stores/UserStore';
import MetaTags from '../../../Components/MetaTags';
import AuthAPIHandler from '../../../APIHandlers/AuthAPIHandler';

const styles = theme => ({
    socialIcon: {
        width: 40,
        height: 40,
        verticalAlign: 'middle',
        marginRight: theme.spacing.unit * 2
    },
    chip: {
        verticalAlign: 'middle'
    },
    button: {
    }
});

class ConnectedAccounts extends React.Component {

    handleDelete = url => () => {
        AuthAPIHandler.fetchDisconnectAccount(url).then(() => {
            UserStore.checkLoggedIn();
        }).catch((err) => {
            console.error(err);
        });
    };

    handleLast = url => () => {
        if(this.props.user.has_password || !window.confirm(this.props.t('connected_settings.no_password_warning'))) {
            this.handleDelete(url)();
        }
    };

    handleConnect = url => () => {
        window.location.replace(`/api/auth/${url}/connect`);
    };

    render() {
        const {t, classes, user} = this.props;

        // Next is really ugly piece of code, but logical XOR like checking for four variables hurts (and this works).
        let count = 0;
        if (user.CTUUsername) count++;
        if (user.googleId) count++;
        if (user.facebookId) count++;
        if (user.twitterId) count++;
        const deleteHandler = count === 1 ? this.handleLast : this.handleDelete;

        return (
            <div>
                <MetaTags title={t('app.titles.connected_settings')}/>
                <Typography variant="title" gutterBottom>
                    {t('connected_settings.title')}
                </Typography>
                <Typography variant="body1" paragraph>
                    {t('connected_settings.paragraph')}
                </Typography>

                <Typography component="div" paragraph>
                    <CTU className={classes.socialIcon}/>

                    {user.CTUUsername && (
                        <Tooltip title={t('connected_settings.disconnect_title')} placement={'right'}>
                            <Chip
                                avatar={
                                    <Avatar>
                                        <Done/>
                                    </Avatar>
                                }
                                label={t('connected_settings.connected_text')}
                                onDelete={deleteHandler('ctu')}
                                className={classes.chip}
                            />
                        </Tooltip>
                    )}

                    {!user.CTUUsername && (
                        <Tooltip title={t('connected_settings.connect_title')} placement={'right'}>
                            <Button variant={'raised'} size={'small'} onClick={this.handleConnect('ctu')}
                                    className={classes.button}>
                                {t('connected_settings.connect_button')}
                            </Button>
                        </Tooltip>
                    )}
                </Typography>
                <Typography component="div" paragraph>
                    <Google className={classes.socialIcon}/>

                    {user.googleId && (
                        <Tooltip title={t('connected_settings.disconnect_title')} placement={'right'}>
                            <Chip
                                avatar={
                                    <Avatar>
                                        <Done/>
                                    </Avatar>
                                }
                                label={t('connected_settings.connected_text')}
                                onDelete={deleteHandler('google')}
                                className={classes.chip}
                            />
                        </Tooltip>
                    )}

                    {!user.googleId && (
                        <Tooltip title={t('connected_settings.connect_title')} placement={'right'}>
                            <Button variant={'raised'} size={'small'} onClick={this.handleConnect('google')}
                                    className={classes.button}>
                                {t('connected_settings.connect_button')}
                            </Button>
                        </Tooltip>
                    )}
                </Typography>
                <Typography component="div" paragraph>
                    <Facebook className={classes.socialIcon}/>

                    {user.facebookId && (
                        <Tooltip title={t('connected_settings.disconnect_title')} placement={'right'}>
                            <Chip
                                avatar={
                                    <Avatar>
                                        <Done/>
                                    </Avatar>
                                }
                                label={t('connected_settings.connected_text')}
                                onDelete={deleteHandler('facebook')}
                                className={classes.chip}
                            />
                        </Tooltip>
                    )}

                    {!user.facebookId && (
                        <Tooltip title={t('connected_settings.connect_title')} placement={'right'}>
                            <Button variant={'raised'} size={'small'} onClick={this.handleConnect('facebook')}
                                    className={classes.button}>
                                {t('connected_settings.connect_button')}
                            </Button>
                        </Tooltip>
                    )}
                </Typography>
                <Typography component="div" paragraph>
                    <Twitter className={classes.socialIcon}/>

                    {user.twitterId && (
                        <Tooltip title={t('connected_settings.disconnect_title')} placement={'right'}>
                            <Chip
                                avatar={
                                    <Avatar>
                                        <Done/>
                                    </Avatar>
                                }
                                label={t('connected_settings.connected_text')}
                                onDelete={deleteHandler('twitter')}
                                className={classes.chip}
                            />
                        </Tooltip>
                    )}

                    {!user.twitterId && (
                        <Tooltip title={t('connected_settings.connect_title')} placement={'right'}>
                            <Button variant={'raised'} size={'small'} onClick={this.handleConnect('twitter')}
                                    className={classes.button}>
                                {t('connected_settings.connect_button')}
                            </Button>
                        </Tooltip>
                    )}
                </Typography>
            </div>
        );
    }
}

ConnectedAccounts.propTypes = {
    user: PropTypes.object.isRequired,
};

export default withStyles(styles)(translate()(ConnectedAccounts));
