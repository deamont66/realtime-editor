import React from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import withStyles from 'material-ui/styles/withStyles';

import {ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';

import Delete from 'material-ui-icons/Delete';
import Edit from 'material-ui-icons/Edit';

import DocumentRightsEnum from "../../../../../Utils/DocumentRightsEnum";
import colorGenerator from "../../../../../Utils/ColorGenerator";
import axios from "../../../../../Utils/Axios";


const styles = theme => ({
    root: {
        padding: theme.spacing.unit,
        paddingRight: 0
    },
    button: {
        width: 32,
        height: 48
    }
});

class IndividualShareItem extends React.Component {

    handleRemoveUserRights = (userId) => {
        axios.delete('/document/' + this.props.documentId + '/rights/' + userId).then(() => {
            this.props.onReload();
        }).catch(err => {
            console.error(err);
            this.props.onClose();
        });
    };

    render() {
        const {t, classes, documentInvite} = this.props;

        const color = colorGenerator(documentInvite.to.username).dark;
        return (
            <ListItem className={classes.root}>
                <ListItemAvatar>
                    <Avatar style={{backgroundColor: color}}>
                        {documentInvite.to.username.slice(0, 2).toLocaleUpperCase()}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={documentInvite.to.username}
                    secondary={t(DocumentRightsEnum[documentInvite.rights].title)}
                />
                <ListItemSecondaryAction>
                    <IconButton aria-label="Edit" className={classes.button}
                                onClick={() => this.props.onUpdate(documentInvite.to.username, documentInvite.rights)}>
                        <Edit/>
                    </IconButton>
                    <IconButton aria-label="Delete" className={classes.button}
                                onClick={() => this.handleRemoveUserRights(documentInvite.to._id)}>
                        <Delete/>
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
}

IndividualShareItem.propTypes = {
    documentInvite: PropTypes.object.isRequired,
    onReload: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    documentId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired
};

export default withStyles(styles)(translate()(IndividualShareItem));
