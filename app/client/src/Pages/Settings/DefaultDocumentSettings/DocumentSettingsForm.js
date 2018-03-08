import React from 'react';
import PropTypes from 'prop-types';
import EditorThemes from "../../../Utils/EditorThemes";
import EditorModes from "../../../Utils/EditorModes";

class DocumentSettingsForm extends React.Component {

    render() {
        return (
            <div className="Comp-DocumentSettingsForm">
                <div className="form-group">
                    <label htmlFor="theme">Theme:</label>
                    <select id="theme" value={this.props.settings.theme} onChange={(event) => {
                        const value = event.target.options[event.target.selectedIndex].value;
                        this.props.onSettingsChange({theme: value});
                    }}>
                        {Object.keys(EditorThemes.all).map((themeKey) => {
                            return <option key={themeKey} value={themeKey}>{EditorThemes.all[themeKey]}</option>
                        })}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="mode">Mode (language):</label>
                    <select id="mode" value={this.props.settings.mode} onChange={(event) => {
                        const value = event.target.options[event.target.selectedIndex].value;
                        this.props.onSettingsChange({mode: value});
                    }}>
                        {EditorModes.all.map((mode, index) => {
                            return <option key={index} value={index}>{mode.lang}</option>
                        })}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="tabSize">TabSize:</label>
                    <select id="tabSize" value={this.props.settings.tabSize} onChange={(event) => {
                        const value = event.target.options[event.target.selectedIndex].value;
                        this.props.onSettingsChange({tabSize: parseInt(value, 10)});
                    }}>
                        {Array.from(Array(4).keys()).map((size) => {
                            return <option key={size} value={(size + 1) * 2}>{(size + 1) * 2}</option>
                        })}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="indentUnit">IndentUnit:</label>
                    <select id="indentUnit" value={this.props.settings.indentUnit} onChange={(event) => {
                        const value = event.target.options[event.target.selectedIndex].value;
                        this.props.onSettingsChange({indentUnit: parseInt(value, 10)});
                    }}>
                        {Array.from(Array(4).keys()).map((size) => {
                            return <option key={size} value={(size + 1) * 2}>{(size + 1) * 2}</option>
                        })}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="indentWithTabs">IndentWithTabs:</label>
                    <input id="indentWithTabs" type="checkbox" checked={this.props.settings.indentWithTabs}
                           onChange={(event) => {
                               const value = event.target.checked;
                               this.props.onSettingsChange({indentWithTabs: value});
                           }}/>
                </div>

                <div className="form-group">
                    <label htmlFor="fontSize">FontSize:</label>
                    <select id="fontSize" value={this.props.settings.fontSize} onChange={(event) => {
                        const value = event.target.options[event.target.selectedIndex].value;
                        this.props.onSettingsChange({fontSize: parseInt(value, 10)});
                    }}>
                        {this.props.settings.fontSize % 2 !== 0 &&
                        <option value={this.props.settings.fontSize}>{this.props.settings.fontSize}</option>}

                        {Array.from(Array(34).keys()).map((size) => {
                            return <option key={size} value={(size + 3) * 2}>{(size + 3) * 2}</option>
                        })}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="keyMap">KeyMap:</label>
                    <select id="keyMap" value={this.props.settings.keyMap} onChange={(event) => {
                        const value = event.target.options[event.target.selectedIndex].value;
                        this.props.onSettingsChange({keyMap: value});
                    }}>
                        {['default', 'emacs', 'sublime', 'vim'].map((keyMap) => {
                            return <option key={keyMap} value={keyMap}>{keyMap}</option>
                        })}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="styleActiveLine">Highlight active line:</label>
                    <select id="styleActiveLine" value={this.props.settings.styleActiveLine} onChange={(event) => {
                        let value = event.target.options[event.target.selectedIndex].value;
                        this.props.onSettingsChange({styleActiveLine: value});
                    }}>
                        {['true', 'nonEmpty', 'false'].map((styleActiveLine) => {
                            return <option key={styleActiveLine} value={styleActiveLine}>{styleActiveLine}</option>
                        })}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="lineWrapping">LineWrapping:</label>
                    <input id="lineWrapping" type="checkbox" checked={this.props.settings.lineWrapping}
                           onChange={(event) => {
                               const value = event.target.checked;
                               this.props.onSettingsChange({lineWrapping: value});
                           }}/>
                </div>

                <div className="form-group">
                    <label htmlFor="lineNumbers">LineNumbers:</label>
                    <input id="lineNumbers" type="checkbox" checked={this.props.settings.lineNumbers}
                           onChange={(event) => {
                               const value = event.target.checked;
                               this.props.onSettingsChange({lineNumbers: value});
                           }}/>
                </div>
            </div>
        );
    }
}

DocumentSettingsForm.propTypes = {
    settings: PropTypes.object.isRequired,
    onSettingsChange: PropTypes.func.isRequired,
};

export default DocumentSettingsForm;
