import React from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import withStyles from 'material-ui/styles/withStyles';

import Typography from 'material-ui/Typography';

import {DocumentSettingsForm} from '../../../Settings/DefaultDocumentSettings';
import RemoveButton from './RemoveButton';

const styles = theme => ({
    title: {
        fontWeight: 500
    },
});

class SettingsMenu extends React.Component {

    render() {
        const {classes, t, allowedOperations} = this.props;

        if (!allowedOperations.includes('write')) return null;

        return (
            <div>
                <Typography className={classes.title} variant={'subheading'}
                            component={'h2'}>{t('settings_menu.title')}</Typography>
                <DocumentSettingsForm settings={this.props.settings} onSettingsChange={this.props.onSettingsChange}/>

                {allowedOperations.includes('remove') && (
                    <RemoveButton documentId={this.props.documentId}/>
                )}
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

export default translate()(withStyles(styles)(SettingsMenu));











