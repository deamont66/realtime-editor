import React from 'react';
import {translate} from 'react-i18next';
import PropTypes from 'prop-types';

import withStyles from 'material-ui/styles/withStyles';

import {FormControl, FormControlLabel} from 'material-ui/Form';
import {InputLabel} from 'material-ui/Input';
import {MenuItem} from 'material-ui/Menu';
import Select from 'material-ui/Select';
import Checkbox from 'material-ui/Checkbox';

import EditorThemes from '../../../Utils/EditorThemes';
import EditorModes from '../../../Utils/EditorModes';

const styles = theme => ({
    formControl: {
        margin: `${theme.spacing.unit}px 0`,
    }
});

class DocumentSettingsForm extends React.Component {

    handleChange = key => (event, checked) => {
        this.props.onSettingsChange({[key]: typeof checked !== 'undefined' ? checked : event.target.value});
    };

    render() {
        const {classes, t} = this.props;

        return (
            <div className="Comp-DocumentSettingsForm">
                <FormControl fullWidth className={classes.formControl}>
                    <InputLabel htmlFor="theme">{t('document_settings.theme')}</InputLabel>
                    <Select inputProps={{id: 'theme'}}
                            value={this.props.settings.theme} onChange={this.handleChange('theme')}>
                        {Object.keys(EditorThemes.all).map((themeKey) => {
                            return <MenuItem key={themeKey} value={themeKey}>{EditorThemes.all[themeKey]}</MenuItem>
                        })}
                    </Select>
                </FormControl>

                <FormControl fullWidth className={classes.formControl}>
                    <InputLabel htmlFor="mode">{t('document_settings.mode')}</InputLabel>
                    <Select inputProps={{id: 'mode'}}
                            value={this.props.settings.mode} onChange={this.handleChange('mode')}>
                        {EditorModes.all.map((mode, index) => {
                            return <MenuItem key={index} value={index}>{mode.lang}</MenuItem>
                        })}
                    </Select>
                </FormControl>

                <FormControl fullWidth className={classes.formControl}>
                    <InputLabel htmlFor="tabSize">{t('document_settings.tabSize')}</InputLabel>
                    <Select inputProps={{id: 'tabSize'}}
                            value={this.props.settings.tabSize} onChange={this.handleChange('tabSize')}>
                        {Array.from(Array(4).keys()).map((size) => {
                            return <MenuItem key={size} value={(size + 1) * 2}>{(size + 1) * 2}</MenuItem>
                        })}
                    </Select>
                </FormControl>

                <FormControl fullWidth className={classes.formControl}>
                    <InputLabel htmlFor="indentUnit">{t('document_settings.indentUnit')}</InputLabel>
                    <Select inputProps={{id: 'indentUnit'}}
                            value={this.props.settings.indentUnit} onChange={this.handleChange('indentUnit')}>
                        {Array.from(Array(4).keys()).map((size) => {
                            return <MenuItem key={size} value={(size + 1) * 2}>{(size + 1) * 2}</MenuItem>
                        })}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.props.settings.indentWithTabs}
                                onChange={this.handleChange('indentWithTabs')}
                            />
                        }
                        label={t('document_settings.indentWithTabs')}
                    />
                </FormControl>

                <FormControl fullWidth className={classes.formControl}>
                    <InputLabel htmlFor="fontSize">{t('document_settings.fontSize')}</InputLabel>
                    <Select inputProps={{id: 'fontSize'}}
                            value={this.props.settings.fontSize} onChange={this.handleChange('fontSize')}>
                        {this.props.settings.fontSize % 2 !== 0 && (
                            <MenuItem value={this.props.settings.fontSize}>{this.props.settings.fontSize}</MenuItem>
                        )}
                        {Array.from(Array(34).keys()).map((size) => {
                            return <MenuItem key={size} value={(size + 3) * 2}>{(size + 3) * 2}</MenuItem>
                        })}
                    </Select>
                </FormControl>

                <FormControl fullWidth className={classes.formControl}>
                    <InputLabel htmlFor="keyMap">{t('document_settings.keyMap.label')}</InputLabel>
                    <Select inputProps={{id: 'keyMap'}}
                            value={this.props.settings.keyMap} onChange={this.handleChange('keyMap')}>
                        {['default', 'emacs', 'sublime', 'vim'].map((keyMap) => {
                            return <MenuItem key={keyMap} value={keyMap}>{t(`document_settings.keyMap.${keyMap}`)}</MenuItem>
                        })}
                    </Select>
                </FormControl>

                <FormControl fullWidth className={classes.formControl}>
                    <InputLabel htmlFor="styleActiveLine">{t('document_settings.styleActiveLine.label')}</InputLabel>
                    <Select inputProps={{id: 'styleActiveLine'}}
                            value={this.props.settings.styleActiveLine} onChange={this.handleChange('styleActiveLine')}>
                        {['nonEmpty', 'true', 'false'].map((styleActiveLine) => {
                            return <MenuItem key={styleActiveLine} value={styleActiveLine}>{t(`document_settings.styleActiveLine.${styleActiveLine}`)}</MenuItem>
                        })}
                    </Select>
                </FormControl>


                <FormControl fullWidth>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.props.settings.lineWrapping}
                                onChange={this.handleChange('lineWrapping')}
                            />
                        }
                        label={t('document_settings.lineWrapping')}
                    />
                </FormControl>

                <FormControl fullWidth>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.props.settings.lineNumbers}
                                onChange={this.handleChange('lineNumbers')}
                            />
                        }
                        label={t('document_settings.lineNumbers')}
                    />
                </FormControl>
            </div>
        );
    }
}

DocumentSettingsForm.propTypes = {
    settings: PropTypes.object.isRequired,
    onSettingsChange: PropTypes.func.isRequired,
};

export default translate()(withStyles(styles)(DocumentSettingsForm));
