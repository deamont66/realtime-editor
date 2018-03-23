import React from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import withStyles from 'material-ui/styles/withStyles';

import Typography from 'material-ui/Typography';
import Select from 'material-ui/Select';
import {MenuItem} from 'material-ui/Menu';
import Button from 'material-ui/Button';
import {InputLabel} from "material-ui/Input";
import {FormControl, FormHelperText} from "material-ui/Form";
import Collapse from 'material-ui/transitions/Collapse';

import DocumentRightsEnum from "../../../../../Utils/DocumentRightsEnum";
import axios from "../../../../../Utils/Axios";

const styles = theme => ({
    root: {
        paddingRight: theme.spacing.unit / 2
    },
    buttons: {
        marginBottom: theme.spacing.unit * 2
    },
    button: {
        marginLeft: theme.spacing.unit
    }
});

class ShareLinkSettings extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            saved: false,
            shareLinkRights: props.shareLinkRights
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.shareLinkRights !== this.state.shareLinkRights)
            this.setState({
                shareLinkRights: nextProps.shareLinkRights
            });
    }

    handleLinkRightsChange = (evt) => {
        this.setState({
            shareLinkRights: evt.target.value
        })
    };

    handleLinkRightsSubmit = (evt) => {
        evt.preventDefault();

        axios.put('/document/' + this.props.documentId + '/rights', {
            shareLinkRights: this.state.shareLinkRights
        }).then(() => {
            this.props.onReload();
            this.handleStatus('saved')(() => {
                this.props.toggleSettingsOpen();
            });
        }).catch(err => {
            console.error(err);
            this.props.onClose();
        });
    };

    handleStatus = field => (cb) => {
        this.setState({
            [field]: true
        }, () => {
            setTimeout(() => this.setState({
                [field]: false
            }, cb), 2000);
        })
    };

    handleCancelClick = () =>  {
        this.props.toggleSettingsOpen();
        this.props.onReload();
    };

    render() {
        const {t, classes} = this.props;

        return (
            <Collapse in={this.props.open} mountOnEnter unmountOnExit className={classes.root}>

                <form onSubmit={this.handleLinkRightsSubmit}>
                    <Typography variant={'subheading'}
                                component={'h3'}>{t('link_rights.link_rights_title')}</Typography>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="linkRights">{t('link_rights.link_rights_label')}</InputLabel>
                        <Select inputProps={{id: 'linkRights'}} onChange={this.handleLinkRightsChange}
                                value={this.state.shareLinkRights}>
                            {DocumentRightsEnum.map((setting, index) => {
                                if (setting.assignable === false) return null;
                                return (
                                    <MenuItem key={index} value={index}>{t(setting.title)}</MenuItem>
                                );
                            })}
                        </Select>
                        <FormHelperText>{this.state.saved && t('link_rights.link_rights_saved_text')}</FormHelperText>
                    </FormControl>

                    <Typography component={'div'} align={'right'} className={classes.buttons}>
                        <Button size="small" className={classes.button} onClick={this.handleCancelClick}>
                            {t('link_rights.link_rights_cancel_button')}
                        </Button>
                        <Button size="small" variant={'raised'} color={'secondary'} className={classes.button}
                                type="submit">
                            {t('link_rights.link_rights_save_button')}
                        </Button>
                    </Typography>
                </form>
            </Collapse>
        );
    }
}

ShareLinkSettings.propTypes = {
    toggleSettingsOpen: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    documentId: PropTypes.string.isRequired,
    shareLinkRights: PropTypes.number.isRequired,
    onReload: PropTypes.func.isRequired
};

export default withStyles(styles)(translate()(ShareLinkSettings));
