import React from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/monokai';

import './Editor.css';
import DocumentStore from "../../../Stores/DocumentStore";

class Editor extends React.Component {

    constructor() {
        super();

        this.state = {
            value: '',
            lastSendValue: '',

            settings: {
                theme: 'monokai'
            }
        };

        this.handleSettingsChange = this.handleSettingsChange.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
    }

    componentDidMount() {
        DocumentStore.on('value', this.handleValueChange);
        DocumentStore.last('value', this.handleValueChange);
        DocumentStore.on('settings', this.handleSettingsChange);
        DocumentStore.last('settings', this.handleSettingsChange);
    }

    componentWillUnmount() {
        DocumentStore.off('value', this.handleValueChange);
        DocumentStore.off('settings', this.handleSettingsChange);
    }

    handleSettingsChange(settings) {
        this.setState({
           settings: settings
        });
    }

    handleValueChange(value) {
        this.setState({
            value: value.content
        });
    }

    render() {
        return (
            <AceEditor
                name="brace-editor"
                mode="javascript"
                theme={this.state.settings.theme}
                readOnly={true}
                onChange={(value) => {
                    this.setState({
                        value: value
                    });
                }}
                value={this.state.value}
                editorProps={{$blockScrolling: true}}
                //height={'calc(100vh - 2 * 30px)'}
                width={'100%'}
            />
        );
    }
}

Editor.propTypes = {
    //user: PropTypes.object.isRequired,
};

export default Editor;
