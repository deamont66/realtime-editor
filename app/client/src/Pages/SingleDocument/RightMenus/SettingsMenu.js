import React from 'react';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';

import axios from '../../../Utils/Axios';

import DocumentSettingsForm from "../../Settings/DefaultDocumentSettings/DocumentSettingsForm";

class SettingsMenu extends React.Component {

    handleRemoveDocumentClick() {
        axios.delete('/document/'+this.props.documentId).then(() => {
            this.props.history.push('/document');
        }).catch((err) => {
            console.error(err);
        })
    }

    render() {
        return (
            <div className="Comp-ShareMenu">
                <DocumentSettingsForm settings={this.props.settings} onSettingsChange={this.props.onSettingsChange}/>
                <br/>
                <p>Removing document cannot be taken back!</p>
                <button onClick={this.handleRemoveDocumentClick.bind(this)}>Remove document</button>
                <br/>
                <button onClick={this.props.onClose}>Close</button>
            </div>
        );
    }
}

SettingsMenu.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSettingsChange: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
    documentId: PropTypes.string.isRequired,
};

SettingsMenu.defaultProps = {
    onClose: () => {}
};

export default withRouter(SettingsMenu);











