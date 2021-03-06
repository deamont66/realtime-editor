import React from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import withStyles from 'material-ui/styles/withStyles';

import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Input, {InputLabel} from 'material-ui/Input';
import {FormControl, FormHelperText} from 'material-ui/Form';
import Tooltip from 'material-ui/Tooltip';

import ContentCopy from 'material-ui-icons/ContentCopy';
import Settings from 'material-ui-icons/Settings';

import ShareButtons from './ShareButtons';
import DocumentRightsEnum from '../../../../../Utils/DocumentRightsEnum';

const styles = theme => ({
    title: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit / 2,
    },
    linkInput: {
        [theme.breakpoints.up('sm')]: {
            width: 'calc(100% - (32px * 2))',
        },
        width: 'calc(100% - (48px * 2))',
        paddingRight: theme.spacing.unit
    },
    linkCopyButtons: {
        [theme.breakpoints.up('sm')]: {
            width: 32,
            height: 32
        }
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
                            component={'h3'} className={classes.title}>
                    {t('link_rights.link_title')}
                    <Tooltip title={t('link_rights.current_level_title')}>
                        <span> ({t(DocumentRightsEnum[this.props.shareLinkRights].title)})</span>
                    </Tooltip>
                </Typography>

                <FormControl className={classes.linkInput} disabled={this.props.shareLinkRights === 0}>
                    <InputLabel htmlFor="link_input">{t('link_rights.link_label')}</InputLabel>
                    <Input id="link_input" readOnly={true} value={window.location.href}
                           onFocus={(evt) => evt.target.select()} onClick={(evt) => evt.target.select()}/>
                    <FormHelperText>{this.state.copied && t('link_rights.link_copied_text')}</FormHelperText>
                </FormControl>
                <Tooltip title={t('link_rights.link_copy_title')}>
                    <div style={{display: 'inline-block'}}>
                        <CopyToClipboard text={window.location} onCopy={this.handleStatus('copied')}>
                            <IconButton className={classes.linkCopyButtons} color="secondary"
                                        disabled={this.props.shareLinkRights === 0}>
                                <ContentCopy/>
                            </IconButton>
                        </CopyToClipboard>
                    </div>
                </Tooltip>
                <Tooltip title={t('link_rights.open_settings_title')}>
                    <IconButton color={this.props.settingsOpen ? 'secondary' : 'default'}
                                className={classes.linkCopyButtons}
                                onClick={this.props.toggleSettingsOpen}>
                        <Settings/>
                    </IconButton>
                </Tooltip>

                {this.props.shareLinkRights !== 0 && <ShareButtons/>}
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
