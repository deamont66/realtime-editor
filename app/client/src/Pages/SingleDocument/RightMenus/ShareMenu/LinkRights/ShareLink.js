import React from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import withStyles from 'material-ui/styles/withStyles';

import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Input, {InputLabel} from "material-ui/Input";
import {FormControl, FormHelperText} from "material-ui/Form";
import Tooltip from "material-ui/Tooltip";

import ContentCopy from 'material-ui-icons/ContentCopy';
import Settings from 'material-ui-icons/Settings';

import ShareButtons from './ShareButtons';
import DocumentRightsEnum from "../../../../../Utils/DocumentRightsEnum";

const styles = theme => ({
    linkInput: {
        width: 'calc(100% - (32px * 2))',
        paddingRight: theme.spacing.unit
    },
    linkCopyButtons: {
        width: 32,
        height: 32
    }
});

class ShareLink extends React.Component {

    constructor() {
        super();

        this.state = {
            copied: false
        }
    }

    handleStatus = field => () => {
        this.setState({
            [field]: true
        }, () => {
            setTimeout(() => this.setState({
                [field]: false
            }), 2000);
        })
    };

    render() {
        const {classes, t} = this.props;

        return (
            <div>
                <Typography variant={'subheading'}
                            component={'h3'}>
                    {t('link_rights.link_title')}
                    <Tooltip title={t('link_rights.current_level_title')}>
                        <span> ({t(DocumentRightsEnum[this.props.shareLinkRights].title)})</span>
                    </Tooltip>
                </Typography>

                <FormControl className={classes.linkInput}>
                    <InputLabel htmlFor="link_input">{t('link_rights.link_label')}</InputLabel>
                    <Input id="link_input" readOnly={true} value={window.location.href}
                           onFocus={(evt) => evt.target.select()} onClick={(evt) => evt.target.select()}/>
                    <FormHelperText>{this.state.copied && t('link_rights.link_copied_text')}</FormHelperText>
                </FormControl>
                <Tooltip title={t('link_rights.link_copy_title')}>
                    <CopyToClipboard text={window.location} onCopy={this.handleStatus('copied')}>
                        <IconButton className={classes.linkCopyButtons} color="secondary">
                            <ContentCopy/>
                        </IconButton>
                    </CopyToClipboard>
                </Tooltip>
                <Tooltip title={t('link_rights.open_settings_title')}>
                    <IconButton color={this.props.settingsOpen ? 'secondary' : 'default'}
                                className={classes.linkCopyButtons}
                                onClick={this.props.toggleSettingsOpen}>
                        <Settings/>
                    </IconButton>
                </Tooltip>

                <ShareButtons/>
            </div>
        );
    }
}

ShareLink.propTypes = {
    settingsOpen: PropTypes.bool.isRequired,
    toggleSettingsOpen: PropTypes.func.isRequired,
    shareLinkRights: PropTypes.number.isRequired
};

export default withStyles(styles)(translate()(ShareLink));
