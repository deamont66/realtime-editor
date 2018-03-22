import React from 'react';
import PropTypes from 'prop-types';

import ShareLinkSettings from "./ShareLinkSettings";
import ShareLink from "./ShareLink";

class LinkRights extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            settingsOpen: false,
        }
    }

    handleSettingsOpenToggle = () => {
        this.setState((old) => ({settingsOpen: !old.settingsOpen}))
    };

    render() {
        return (
            <div>
                <ShareLink toggleSettingsOpen={this.handleSettingsOpenToggle}
                           settingsOpen={this.state.settingsOpen}
                           shareLinkRights={this.props.shareLinkRights}
                />

                <ShareLinkSettings onReload={this.props.onReload}
                                   onClose={this.props.onClose}
                                   documentId={this.props.documentId}
                                   shareLinkRights={this.props.shareLinkRights}
                                   open={this.state.settingsOpen}
                />
            </div>
        );
    }
}

LinkRights.propTypes = {
    documentId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    shareLinkRights: PropTypes.number.isRequired,
    onReload: PropTypes.func.isRequired
};

export default LinkRights;
