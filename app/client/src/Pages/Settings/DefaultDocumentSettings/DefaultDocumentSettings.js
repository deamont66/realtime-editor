import React from 'react';
import PropTypes from 'prop-types';

import axios from '../../../Utils/Axios';

import DocumentSettingsForm from "./DocumentSettingsForm";


class DefaultDocumentSettings extends React.Component {

    constructor() {
        super();
        this.state = {
            settings: null
        }
    }

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
            console.log('Saved');
            this.setState({
                settings: res.data.settings
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    render() {
        return (
            <div className="Comp-DefaultDocumentSettings">
                {this.state.settings === null && "Loading"}

                {this.state.settings !== null && <form onSubmit={this.handleSubmit.bind(this)} className="settings-form">

                    <DocumentSettingsForm settings={this.state.settings} onSettingsChange={this.handleSettingsChange.bind(this)}/>

                    <button typeof="submit">Uložit</button>
                </form>}

                {JSON.stringify(this.state.settings)}
            </div>
        );
    }
}

DefaultDocumentSettings.propTypes = {
    user: PropTypes.object.isRequired,
};

export default DefaultDocumentSettings;
