import React from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import withStyles from 'material-ui/styles/withStyles';

import Typography from 'material-ui/Typography';
import {CircularProgress} from 'material-ui/Progress';

import LinkRights from "./LinkRights";
import axios from "../../../../Utils/Axios";


const styles = theme => ({
    title: {
        fontWeight: 500
    },
});

class ShareMenu extends React.Component {

    constructor() {
        super();

        this.state = {
            shareLinkRights: null,
            documentInvites: [],

            username: '',
            selectedRights: 0
        }
    }

    componentDidMount() {
        this.loadRights();
    }

    loadRights = () => {
        axios.get('/document/' + this.props.documentId + '/rights').then((res) => {
            this.setState({
                shareLinkRights: res.data.shareLinkRights,
                documentInvites: res.data.documentInvites
            });
        }).catch(err => {
            console.error(err);
            this.props.onClose();
        });
    };




    handleChangeUserRights = (username, rights) => {
        if (!username || rights === 0) return;
        axios.put('/document/' + this.props.documentId + '/rights/invite', {
            rights: rights,
            to: username
        }).then(() => {
            this.loadRights();
        }).catch(err => {
            if (err.response.status === 404) {
                console.log('Username not found');
            } else {
                this.props.onClose();
            }
            console.error(err.response);
        });
    };

    handleRemoveUserRights = (userId) => {
        axios.delete('/document/' + this.props.documentId + '/rights/' + userId).then(() => {
            this.loadRights();
        }).catch(err => {
            console.error(err);
        });
    };

    handleUpdateUserRightsButton(username, rights) {
        this.setState({
            username: username,
            selectedRights: rights
        });
    };

    render() {
        const {classes, t, allowedOperations} = this.props;

        if (!allowedOperations.includes('share')) return null;

        return (
            <div>
                <Typography className={classes.title} variant={'subheading'}
                            component={'h2'}>{t('share_menu.title')}</Typography>

                {this.state.shareLinkRights === null && (
                    <Typography align={'center'} component={'div'}>
                        <CircularProgress/>
                    </Typography>
                )}

                {this.state.shareLinkRights !== null && (
                    <LinkRights shareLinkRights={this.state.shareLinkRights}
                                documentId={this.props.documentId}
                                onClose={this.props.onClose}
                                onReload={this.loadRights}
                    />
                )}

                <p>Next</p>


            </div>
        );
    }


    /*return (

            <hr/>
            <div>
                <h3>Shared with:</h3>
                <ul>
                    {this.state.documentInvites.map((documentInvite) => {
                        return (
                            <li key={documentInvite.to._id}>{documentInvite.to.username} {DocumentRightsEnum[documentInvite.rights].title}
                                <button onClick={() => this.handleUpdateUserRightsButton(documentInvite.to.username, documentInvite.rights)}>Update</button>
                                <button
                                    onClick={() => this.handleRemoveUserRights(documentInvite.to._id)}>Remove
                                </button>
                            </li>
                        )
                    })}
                </ul>
                <input type="text" value={this.state.username}
                       onChange={(evt) => this.setState({username: evt.target.value})}/>
                <select
                    onChange={(evt) => this.setState({selectedRights: Number(evt.target.options[evt.target.selectedIndex].value)})}
                    value={this.state.selectedRights}>
                    {DocumentRightsEnum.map((setting, index) => {
                        if (setting.assignable === false || index === 0) return null;
                        return (
                            <option key={index} value={index}>{setting.title}</option>
                        );
                    })}
                </select>
                <button
                    onClick={() => this.handleChangeUserRights(this.state.username, this.state.selectedRights)}>Share
                </button>
            </div>

            <button onClick={this.props.onClose}>Close</button>
        </div>
    );*/

}

ShareMenu.propTypes = {
    onClose: PropTypes.func.isRequired,
    documentId: PropTypes.string.isRequired,
};

ShareMenu.defaultProps = {
    onClose: () => {
    }
};

export default withStyles(styles)(translate()(ShareMenu));
