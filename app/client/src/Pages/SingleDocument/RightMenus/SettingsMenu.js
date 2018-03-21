import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {translate} from 'react-i18next';
import withStyles from 'material-ui/styles/withStyles';

import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import axios from '../../../Utils/Axios';

import DocumentSettingsForm from "../../Settings/DefaultDocumentSettings/DocumentSettingsForm";

const styles = theme => ({
    title: {
        fontWeight: 500
    },
});

class SettingsMenu extends React.Component {

    handleRemoveDocumentClick = () => {
        if (window.confirm(this.props.t('settings_menu.remove_question'))) {
            axios.delete('/document/' + this.props.documentId).then(() => {
                this.props.history.push('/document');
            }).catch((err) => {
                console.error(err);
            });
        }
    };

    render() {
        const {classes, t, allowedOperations} = this.props;

        if(!allowedOperations.includes('write')) return null;

        return (
            <div className="Comp-ShareMenu">
                <Typography className={classes.title} variant={'subheading'}
                            component={'h2'}>{t('settings_menu.title')}</Typography>
                <DocumentSettingsForm settings={this.props.settings} onSettingsChange={this.props.onSettingsChange}/>

                {allowedOperations.includes('remove') && <div>
                    <Typography className={classes.title} variant={'subheading'} component={'h3'}
                                paragraph>{t('settings_menu.remove_title')}</Typography>
                    <Typography variant={'body1'} paragraph>{t('settings_menu.remove_text')}</Typography>

                    <Button size={'small'} variant={'raised'}
                            onClick={this.handleRemoveDocumentClick}>{t('settings_menu.remove_button')}</Button>
                </div>}
            </div>
        );
    }
}

SettingsMenu.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSettingsChange: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
    documentId: PropTypes.string.isRequired,
    allowedOperations: PropTypes.array.isRequired,
};

SettingsMenu.defaultProps = {
    onClose: () => {
    }
};

export default translate()(withRouter(withStyles(styles)(SettingsMenu)));











