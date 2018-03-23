import React from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';

import withStyles from 'material-ui/styles/withStyles';

import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import {FormControl, FormHelperText} from "material-ui/Form";
import Input, {InputLabel} from "material-ui/Input";
import {MenuItem} from "material-ui/Menu";
import Select from "material-ui/Select";

import Collapse from 'material-ui/es/transitions/Collapse';

import DocumentRightsEnum from '../../../../../Utils/DocumentRightsEnum';
import axios from '../../../../../Utils/Axios';

const styles = theme => ({
    root: {
        paddingRight: theme.spacing.unit / 2
    },
    usernameInput: {
        width: 162
    },
    rightsSelect: {
        marginLeft: theme.spacing.unit,
        width: 125
    },
    buttonWrapper: {
        position: 'absolute',
        top: -theme.spacing.unit / 2,
        right: theme.spacing.unit / 2
    },
    button: {
        marginLeft: theme.spacing.unit
    }
});

class AddIndividualShare extends React.Component {

    constructor() {
        super();

        this.state = {
            open: false,
            usernameError: null,
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.value && nextProps.value.username !== '') this.setState({open: true});
    }

    toggleOpenState = () => {
        this.props.onChange({username: '', rights: 1});
        this.setState((oldState) => ({
            open: !oldState.open,
            usernameError: null
        }));
    };

    handleUsernameChange(username) {
        this.setState({usernameError: null});
        this.props.onChange({username, rights: this.props.value.rights});
    };

    handleRightsChange(rights) {
        this.props.onChange({rights, username: this.props.value.username});
    };

    handleChangeUserRightsSubmit = (username, rights) => {
        if (!username) {
            this.setState({
                usernameError: 'username.validation.required'
            });
            return;
        }

        axios.put('/document/' + this.props.documentId + '/rights/invite', {
            rights: rights,
            to: username
        }).then(() => {
            this.props.onReload();
            this.toggleOpenState();
        }).catch(err => {
            if ([404, 422].includes(err.response.status)) {
                this.setState({
                    usernameError: err.response.data.message
                });
            } else {
                console.error(err.response);
                this.props.onClose();
            }
        });
    };

    render() {
        const {classes, t} = this.props;
        return (
            <form className={classes.root} onSubmit={(evt) => {
                evt.preventDefault();
                this.handleChangeUserRightsSubmit(this.props.value.username, this.props.value.rights)
            }}>
                <Collapse in={!this.state.open} className={classes.buttonWrapper} mountOnEnter unmountOnExit>
                    <Button className={classes.button} size="small" color="secondary"
                            onClick={this.toggleOpenState}>
                        {t('add_individual_share.new_invite_button')}
                    </Button>
                </Collapse>
                <Collapse in={this.state.open} mountOnEnter unmountOnExit>
                    <FormControl error={this.state.usernameError !== null} className={classes.usernameInput}>
                        <InputLabel htmlFor="userRights">{t('add_individual_share.username_label')}</InputLabel>
                        <Input value={this.props.value.username}
                               onChange={(evt) => this.handleUsernameChange(evt.target.value)}/>
                        <FormHelperText>{this.state.usernameError !== null && t(this.state.usernameError)}</FormHelperText>
                    </FormControl>

                    <FormControl className={classes.rightsSelect}>
                        <InputLabel htmlFor="userRights">{t('add_individual_share.rights_label')}</InputLabel>
                        <Select inputProps={{id: 'userRights'}}
                                onChange={(evt) => this.handleRightsChange(evt.target.value)}
                                value={this.props.value.rights}>
                            {DocumentRightsEnum.map((setting, index) => {
                                if (setting.assignable === false || index === 0) return null;
                                return (
                                    <MenuItem key={index} value={index}>{t(setting.title)}</MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>

                    <Typography align="right" component="div">
                        <Button className={classes.button} size="small"
                                onClick={this.toggleOpenState}>{t('add_individual_share.cancel_button')}</Button>
                        <Button className={classes.button} size="small" variant="raised" color="secondary"
                                type="submit">
                            {t('add_individual_share.invite_button')}
                        </Button>
                    </Typography>
                </Collapse>
            </form>
        );
    }
}

AddIndividualShare.propTypes = {
    documentId: PropTypes.string.isRequired,
    value: PropTypes.shape({
        username: PropTypes.string.isRequired,
        rights: PropTypes.number.isRequired
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    onReload: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

export default withStyles(styles)(translate()(AddIndividualShare));
