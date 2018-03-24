import React from 'react';
import {translate} from 'react-i18next';
import PropTypes from 'prop-types';

import withStyles from 'material-ui/styles/withStyles';

import Typography from 'material-ui/Typography';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import {LinearProgress} from 'material-ui/Progress'

import CloseIcon from 'material-ui-icons/Close';

import axios from '../../../Utils/Axios';

import DocumentSettingsForm from "./DocumentSettingsForm";
import SubmitButtons from "../SubmitButtons";
import MetaTags from "../../../Components/MetaTags";

const styles = theme => ({
    close: {
        width: theme.spacing.unit * 4,
        height: theme.spacing.unit * 4,
    }
});

class DefaultDocumentSettings extends React.Component {

    constructor() {
        super();
        this.state = {
            settings: null,
            open: false,
            message: '',
            loading: false
        }
    }

    showMessage = (message) => {
        this.setState({
            open: true,
            message: message
        });
    };

    handleClose = () => {
        this.setState({
            open: false
        });
    };

    componentDidMount() {
        this.loadUserSettings();
    }

    loadUserSettings() {
        axios.get('/user/document-settings').then((res) => {
            this.setState({
                settings: res.data.settings
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    handleSettingsChange(change) {
        this.setState((oldState) => {
            return {
                settings: Object.assign({}, oldState.settings, change)
            };
        })
    }

    handleSubmit(evt) {
        evt.preventDefault();

        this.setState({loading: true});
        axios.put('/user/document-settings', {
            settings: this.state.settings
        }).then((res) => {
            this.showMessage(this.props.t('settings.saved'));
            this.setState({
                settings: res.data.settings,
                loading: false
            });
        }).catch((err) => {
            console.log(err);
            this.setState({loading: false});
        });
    }

    render() {
        const {t} = this.props;
        return (
            <div className="Comp-DefaultDocumentSettings">
                <MetaTags title={t('app.titles.document_settings')}/>
                {this.state.settings === null && <LinearProgress/>}

                {this.state.settings !== null && <form onSubmit={this.handleSubmit.bind(this)} className="settings-form">

                    <Typography variant="title" gutterBottom>
                        {t('default_document_settings.title')}
                    </Typography>

                    <Typography paragraph>
                        {t('default_document_settings.paragraph')}
                    </Typography>

                    <DocumentSettingsForm settings={this.state.settings} onSettingsChange={this.handleSettingsChange.bind(this)}/>

                    <SubmitButtons loading={this.state.loading} onReset={() => this.loadUserSettings()}/>
                </form>}
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.open}
                    autoHideDuration={6000}
                    onClose={this.handleClose}
                    SnackbarContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{this.state.message}</span>}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            className={this.props.classes.close}
                            onClick={this.handleClose}
                        >
                            <CloseIcon/>
                        </IconButton>,
                    ]}
                />
            </div>
        );
    }
}

DefaultDocumentSettings.propTypes = {
    user: PropTypes.object.isRequired,
};

export default translate()(withStyles(styles)(DefaultDocumentSettings));
