import React from 'react';
import {translate} from 'react-i18next';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import withStyles from 'material-ui/styles/withStyles';

import Tooltip from 'material-ui/Tooltip';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import Badge from 'material-ui/Badge';

import Chat from 'material-ui-icons/Chat';
import Settings from 'material-ui-icons/Settings';

const styles = theme => ({
    root: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    },
    item: {
        float: 'right',
        marginLeft: theme.spacing.unit
    },
    avatar: {
        marginTop: theme.spacing.unit,
        color: theme.palette.common.white
    },
    avatarButton: {
        boxShadow: 'none',
        color: theme.palette.common.white,
        backgroundColor: theme.palette.grey[400]
    },
    separator: {
        float: 'right',
        marginTop: 10,
        marginLeft: theme.spacing.unit,
        borderLeft: `2px dashed ${theme.palette.grey[300]}`,
        height: 35,
    },
    sharedButton: {
        position: 'relative',
        top: 4,
        marginRight: theme.spacing.unit * 2
    }
});

class DocumentClients extends React.Component {

    render() {
        const {classes, t, toggleMenu, allowedOperations} = this.props;

        const realClients = this.props.clients.filter((s1, pos, arr) => {
            // removes next records with same name (every username will be shown only once)
            return arr.findIndex((s2) => s2.name === s1.name) === pos
        });

        const showMaxClients = 5;
        const moreCount = realClients.length - showMaxClients;

        return (
            <ul className={classes.root}>
                {allowedOperations.includes('write') && (
                    <li className={classes.item}>
                        <Tooltip title={t('document_clients.settings_title')} placement="bottom">
                            <Button variant="fab" mini className={classNames(classes.avatar, classes.avatarButton)}
                                    onClick={() => toggleMenu('settings')}>
                                <Settings/>
                            </Button>
                        </Tooltip>
                    </li>
                )}
                {allowedOperations.includes('chat') && (
                    <li className={classes.item}>
                        <Tooltip title={t('document_clients.chat_title')} placement="bottom">
                            <Button variant="fab" mini className={classNames(classes.avatar, classes.avatarButton)}
                                    onClick={() => toggleMenu('chat')}>
                                <Chat/>
                            </Button>
                        </Tooltip>
                    </li>
                )}
                {(allowedOperations.includes('write') || allowedOperations.includes('chat')) && (
                    <li className={classes.separator}>&nbsp;</li>
                )}
                {moreCount > 0 && (
                    <li className={classes.item}>
                        <Tooltip title={t('document_clients.next_clients', {count: moreCount})} placement="bottom">
                            <Avatar className={classes.avatar}>
                                {moreCount.toString().slice(0, 2).toLocaleUpperCase()}
                            </Avatar>
                        </Tooltip>
                    </li>
                )}
                {realClients.reverse().slice(0, showMaxClients).map((client) => {
                    const name = client.name || t('document_clients.anonymous');

                    return (
                        <li key={client.id} className={classes.item}>
                            <Tooltip title={name} placement="bottom">
                                <Avatar style={{backgroundColor: client.color}} className={classes.avatar}>
                                    {name.slice(0, 2).toLocaleUpperCase()}
                                </Avatar>
                            </Tooltip>
                        </li>
                    )
                })}
                {allowedOperations.includes('share') && (
                    <li className={classes.item}>
                        <Tooltip title={t('document_clients.share_title')} placement="bottom">
                            <Button variant="raised" color="secondary" size="small"
                                    className={classNames(classes.avatar, classes.sharedButton)}
                                    onClick={() => toggleMenu('share')}>
                                {t('document_clients.share_text')}
                            </Button>
                        </Tooltip>
                    </li>
                )}
            </ul>
        );
    }
}

DocumentClients.propTypes = {
    clients: PropTypes.array.isRequired,
    toggleMenu: PropTypes.func.isRequired,
    allowedOperations: PropTypes.array.isRequired,
};

export default translate()(withStyles(styles)(DocumentClients));
