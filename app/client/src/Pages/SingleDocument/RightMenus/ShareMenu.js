import React from 'react';

import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import axios from '../../../Utils/Axios';

import DocumentRightsEnum from '../../../Utils/DocumentRightsEnum';


class ShareMenuIcon extends React.Component {

    render() {
        return (
            <div className={ClassNames('Comp-ShareMenuIcon menu-icon', {
                active: this.props.active
            })}>
                <a href="#share" title="Share" onClick={(evt) => {
                    evt.preventDefault();
                    this.props.onClick();
                }}>
                    <FontAwesomeIcon icon="share-square"/>
                    <span className="sr-only">Share</span>
                </a>
            </div>
        );
    }
}

ShareMenuIcon.propTypes = {
    onClick: PropTypes.func.isRequired,
    active: PropTypes.bool.isRequired
};

ShareMenuIcon.defaultProps = {
    onClick: () => {
    },
    active: false
};

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

    loadRights() {
        axios.get('/document/' + this.props.documentId + '/rights').then((res) => {
            this.setState({
                shareLinkRights: res.data.shareLinkRights,
                documentInvites: res.data.documentInvites
            });
        });
    }

    handleLinkRightsChange(evt) {
        this.setState({
            shareLinkRights: Number(evt.target.options[evt.target.selectedIndex].value)
        })
    }

    handleLinkRightsSubmit() {
        axios.put('/document/' + this.props.documentId + '/rights', {
            shareLinkRights: this.state.shareLinkRights
        }).then(() => {
            this.loadRights();
        }).catch((err) => {
            console.error(err);
        });
    }

    handleChangeUserRights(username, rights) {
        if(!username || rights === 0) return;
        axios.put('/document/' + this.props.documentId + '/rights/invite', {
            rights: rights,
            to: username
        }).then(() => {
            this.loadRights();
        }).catch((err) => {
            if (err.response.status === 404) {
                console.log('Username not found');
            }
            console.error(err.response);
        });
    }

    handleRemoveUserRights(userId) {
        axios.delete('/document/' + this.props.documentId + '/rights/' + userId).then(() => {
            this.loadRights();
        }).catch((err) => {
            console.error(err);
        });
    }

    handleUpdateUserRightsButton(username, rights) {
        this.setState({
            username: username,
            selectedRights: rights
        });
    }

    render() {
        console.log(this.state.shareLinkRights, this.state.documentInvites);
        return (
            <div className="Comp-ShareMenu">
                {this.state.shareLinkRights === null && <p>Loading...</p>}
                {this.state.shareLinkRights !== null && <div>
                    <h3>Public link:</h3>
                    <input type="text" readOnly={true} value={window.location}/>
                    <CopyToClipboard text={window.location} onCopy={() => console.log('Copied')}>
                        <button>Copy</button>
                    </CopyToClipboard>
                    <br/>
                    <select onChange={this.handleLinkRightsChange.bind(this)} value={this.state.shareLinkRights}>
                        {DocumentRightsEnum.map((setting, index) => {
                            if (setting.assignable === false) return null;
                            return (
                                <option key={index} value={index}>{setting.title}</option>
                            );
                        })}
                    </select>
                    <button onClick={this.handleLinkRightsSubmit.bind(this)}>Update</button>
                </div>}
                <hr/>
                {this.state.shareLinkRights !== null && <div>
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
                </div>}

                <button onClick={this.props.onClose}>Close</button>
            </div>
        );
    }
}

ShareMenu.propTypes = {
    onClose: PropTypes.func.isRequired,
    documentId: PropTypes.string.isRequired,
};

ShareMenu.defaultProps = {
    onClose: () => {
    }
};

export default {
    menu: ShareMenu,
    icon: ShareMenuIcon
};
