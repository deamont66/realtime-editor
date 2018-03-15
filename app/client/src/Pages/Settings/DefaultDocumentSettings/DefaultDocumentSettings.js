import React from 'react';
import PropTypes from 'prop-types';

import withStyles from 'material-ui/styles/withStyles';

import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import {LinearProgress} from 'material-ui/Progress'

import CloseIcon from 'material-ui-icons/Close';

import axios from '../../../Utils/Axios';

import DocumentSettingsForm from "./DocumentSettingsForm";
import SubmitButtons from "../SubmitButtons";

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
            message: ''
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

        axios.put('/user/document-settings', {
            settings: this.state.settings
        }).then((res) => {
            this.showMessage('Changes saved');
            this.setState({
                settings: res.data.settings
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    render() {
        const {classes} = this.props;

        return (
            <div className="Comp-DefaultDocumentSettings">
                {this.state.settings === null && <LinearProgress/>}

                {this.state.settings !== null && <form onSubmit={this.handleSubmit.bind(this)} className="settings-form">

                    <Typography variant="title" gutterBottom>
                        Default settings
                    </Typography>

                    <Typography paragraph>
                        This settings is used as default for newly created documents. Already existing documents and their current settings will not be changed.
                    </Typography>

                    <DocumentSettingsForm settings={this.state.settings} onSettingsChange={this.handleSettingsChange.bind(this)}/>

                    <SubmitButtons onReset={() => this.loadUserSettings()}/>
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

export default withStyles(styles)(DefaultDocumentSettings);
