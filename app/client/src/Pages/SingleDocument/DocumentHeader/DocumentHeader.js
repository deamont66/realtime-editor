import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from "./DocumentTitle";
import DocumentStatus from "./DocumentStatus";
import DocumentClients from "./DocumentClients";

class DocumentHeader extends React.Component {

    render() {
        return (
            <div className="Comp-DocumentHeader">
                <DocumentTitle title={this.props.title}
                                   onSettingsChange={this.props.onSettingsChange}/>

                <DocumentStatus disconnected={this.props.disconnected} state={this.props.clientState}/>

                <DocumentClients clients={this.props.clients}/>
            </div>
        );
    }
}

DocumentHeader.propTypes = {
    disconnected: PropTypes.bool.isRequired,
    clientState: PropTypes.string.isRequired,

    title: PropTypes.string.isRequired,
    onSettingsChange: PropTypes.func.isRequired,

    clients: PropTypes.array.isRequired
};

export default DocumentHeader;
