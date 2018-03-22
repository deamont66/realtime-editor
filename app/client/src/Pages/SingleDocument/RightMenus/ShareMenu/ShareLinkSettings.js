import React from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';

import Typography from 'material-ui/Typography';
import Select from 'material-ui/Select';
import {MenuItem} from 'material-ui/Menu';
import Button from 'material-ui/Button';
import {InputLabel} from "material-ui/Input";
import {FormControl, FormHelperText} from "material-ui/Form";
import Collapse from 'material-ui/transitions/Collapse';

import DocumentRightsEnum from "../../../../Utils/DocumentRightsEnum";
import axios from "../../../../Utils/Axios";

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

    handleLinkRightsSubmit = () => {
        axios.put('/document/' + this.props.documentId + '/rights', {
            shareLinkRights: this.state.shareLinkRights
        }).then(() => {
            this.props.onReload();
            this.handleStatus('saved')();
        }).catch(err => {
            console.error(err);
            this.props.onClose();
        });
    };

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
        const {t} = this.props;

        return (
            <Collapse in={this.props.open} mountOnEnter unmountOnExit>
                <div>
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

                    <Typography component={'div'} align={'right'}>
                        <Button onClick={this.props.onReload}>
                            {t('link_rights.link_rights_cancel_button')}
                        </Button>
                        <Button variant={'raised'} color={'secondary'} onClick={this.handleLinkRightsSubmit}>
                            {t('link_rights.link_rights_save_button')}
                        </Button>
                    </Typography>
                </div>
            </Collapse>
        );
    }
}

ShareLinkSettings.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    documentId: PropTypes.string.isRequired,
    shareLinkRights: PropTypes.number.isRequired,
    onReload: PropTypes.func.isRequired
};

export default translate()(ShareLinkSettings);
