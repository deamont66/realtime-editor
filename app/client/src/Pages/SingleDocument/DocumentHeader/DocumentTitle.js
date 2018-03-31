import React from 'react';
import {translate} from 'react-i18next';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import withStyles from 'material-ui/styles/withStyles';
import Input from 'material-ui/Input';
import Tooltip from 'material-ui/Tooltip';
import IconButton from 'material-ui/IconButton';
import {CircularProgress} from 'material-ui/Progress';

import Save from 'material-ui-icons/Save';

const styles = theme => ({
    input: {
        ...theme.typography.headline,
        '&:not(:hover):before': {
            backgroundColor: 'transparent',
        },
        marginTop: -6,
    },
    button: {
        verticalAlign: 'baseline',
        position: 'relative',
        top: 4,
        height: 39,
        width: 39
    },
    buttonProgress: {
        marginLeft: -39,
        position: 'relative',
        top: 12,
        verticalAlign: 'baseline',
    },
    tooltip: {
        display: 'inline-block',
        position: 'relative',
        width: 39,
        opacity: 1,

        transition: `all ${theme.transitions.duration.short}ms ${theme.transitions.easing.easeInOut}`
    },
    hidden: {
        opacity: 0,
        width: 10,
        zIndex: -1
    },
});

class DocumentTitle extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            sending: false,
            newTitle: props.title
        };
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.title === this.props.title) return;
        this.setState({
            newTitle: nextProps.title,
            sending: false
        });
    };

    handleTitleChange = (evt) => {
        if (this.props.readOnly) return;
        this.setState({
            newTitle: evt.target.value
        });
    };

    handleTitleButtonClick = () => {
        if (this.props.readOnly) return;
        this.setState((oldState) => {
            const newTitle = oldState.newTitle.trim();
            if (newTitle !== this.props.title && newTitle.length > 0) {
                this.props.onSettingsChange({title: newTitle});
                return {
                    sending: true,
                };
            } else {
                return {
                    newTitle: this.props.title
                };
            }
        });
    };

    /**
     * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
     *
     * @param {String} text The text to be rendered.
     * @param {Number} fontSize
     *
     * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
     */
    getTextWidth = (text, fontSize) => {
        // re-use canvas object for better performance
        if (!this.canvas) this.canvas = document.createElement("canvas");
        const context = this.canvas.getContext("2d");
        context.font = fontSize + " " + this.props.theme.typography.fontFamily;
        const metrics = context.measureText(text);
        return metrics.width;
    };

    render() {
        const {classes, t} = this.props;

        const inputWidth = Math.min(Math.max(50, this.getTextWidth(this.state.newTitle || t('documentTable.unnamedDocument'), '24px') + 5), window.innerWidth - 120);

        return (
            <div style={{display: 'inline-block'}}>
                <Input value={this.state.newTitle}
                       style={{width: inputWidth}}
                       className={classes.input} margin={'none'}
                       placeholder={t('documentTable.unnamedDocument')}
                       onChange={this.handleTitleChange}
                       disableUnderline={this.props.readOnly}
                />
                <Tooltip title={t('document_title.save_button')} placement="bottom"
                         className={classNames(classes.tooltip, {[classes.hidden]: this.state.newTitle === this.props.title})}>
                    <div style={{display: 'inline-block'}}>
                        <IconButton onClick={this.handleTitleButtonClick} color={"secondary"}
                                    className={classes.button}>
                            <Save/>
                        </IconButton>
                        {this.state.sending && <CircularProgress size={40} className={classes.buttonProgress}/>}
                    </div>
                </Tooltip>
            </div>
        );
    }
}

DocumentTitle.propTypes = {
    onSettingsChange: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    readOnly: PropTypes.bool.isRequired,
};

DocumentTitle.defaultProps = {};

export default translate()(withStyles(styles, {withTheme: true})(DocumentTitle));
