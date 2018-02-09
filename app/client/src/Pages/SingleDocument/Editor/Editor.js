import React from 'react';
import AceEditor from 'react-ace';

import EditorModes from '../../../Utils/EditorModes';
import EditorThemes from '../../../Utils/EditorThemes';

import './Editor.css';
import DocumentStore from "../../../Stores/DocumentStore";
import Loading from "../../Components/Loading";

EditorModes.require();
EditorThemes.require();

class Editor extends React.Component {

    constructor() {
        super();

        this.state = {
            value: '',
            lastSendValue: '',

            settings: null
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
        if(!settings) return;
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
        if(!this.state.settings) {
            return <Loading fullScreen={false}/>
        }
        return (
            <AceEditor
                name="brace-editor"
                mode={this.state.settings.mode}
                theme={this.state.settings.theme}
                readOnly={this.state.settings.readOnly}
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
};

export default Editor;
