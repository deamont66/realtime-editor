import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from "../DocumentTitle";
import DocumentStatus from "../DocumentStatus";

class DocumentHeader extends React.Component {

    render() {
        return (
            <div className="Comp-DocumentHeader">
                <DocumentTitle title={this.props.title}
                                   onSettingsChange={this.props.onSettingsChange}/>

                <DocumentStatus disconnected={this.props.disconnected} state={this.props.clientState}/>
            </div>
        );
    }
}

DocumentHeader.propTypes = {
    disconnected: PropTypes.bool.isRequired,
    clientState: PropTypes.string.isRequired,

    title: PropTypes.string.isRequired,
    onSettingsChange: PropTypes.func.isRequired,
};

export default DocumentHeader;
