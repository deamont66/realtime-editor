import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {translate} from 'react-i18next';
import withStyles from 'material-ui/styles/withStyles';

import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import DocumentAPIHandler from '../../../../APIHandlers/DocumentAPIHandler';

const styles = theme => ({
    title: {
        fontWeight: 500
    },
});

class RemoveButton extends React.Component {

    handleRemoveDocumentClick = () => {
        if (window.confirm(this.props.t('settings_menu.remove_question'))) {
            DocumentAPIHandler.fetchRemoveDocument(this.props.documentId).then(() => {
                this.props.history.push('/document');
            }).catch((err) => {
                console.error(err);
            });
        }
    };

    render() {
        const {classes, t} = this.props;

        return (
            <div>
                <br/>
                <Typography className={classes.title} variant={'subheading'} component={'h3'} paragraph>
                    {t('settings_menu.remove_title')}
                </Typography>
                <Typography variant={'body1'} gutterBottom>{t('settings_menu.remove_text')}</Typography>
                <Typography align="right" variant={'body1'}>
                    <Button size={'small'} variant={'raised'}
                            onClick={this.handleRemoveDocumentClick}>
                        {t('settings_menu.remove_button')}
                    </Button>
                </Typography>
            </div>
        );
    }
}

RemoveButton.propTypes = {
    documentId: PropTypes.string.isRequired,
};

export default withStyles(styles)(translate()(withRouter(RemoveButton)));