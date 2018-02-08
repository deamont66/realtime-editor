import React from 'react';
import PropTypes from 'prop-types';


import './DocumentTitle.css';
import DocumentStore from "../../Stores/DocumentStore";

class DocumentTitle extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            editingTitle: false,
            title: '',
            newTitle: ''
        };

        this.handleTitleButtonClick = this.handleTitleButtonClick.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);

        this.handleSettingsChange = this.handleSettingsChange.bind(this);
    }

    componentDidMount() {
        DocumentStore.on('settings', this.handleSettingsChange);
        DocumentStore.last('settings', this.handleSettingsChange);
    }

    componentWillUnmount() {
        DocumentStore.off('settings', this.handleSettingsChange);
    }

    handleSettingsChange(settings) {
        this.setState({
            title: settings.title
        });
    }

    handleTitleChange(evt) {
        this.setState({
            newTitle: evt.target.value
        });
    }

    handleTitleButtonClick() {
        this.setState((oldState) => {
            let title = oldState.title;
            if (oldState.editingTitle) {
                // send to DocumentStore
                title = oldState.newTitle;
            }
            return {
                editingTitle: !oldState.editingTitle,
                title: title,
                newTitle: title
            };
        });
    }

    render() {
        return (
            <div className="Comp-DocumentTitle">
                {!this.state.editingTitle
                && <h1 onClick={this.handleTitleButtonClick}>{this.state.title}</h1>}

                {this.state.editingTitle
                && <input type="text" value={this.state.newTitle} onChange={this.handleTitleChange}/>}

                <button onClick={this.handleTitleButtonClick} title={this.state.editingTitle ? 'Save title' : 'Edit title'}>
                    <i className="fas fa-edit"/>
                    <span className="sr-only">{this.state.editingTitle ? 'Save title' : 'Edit title'}</span>
                </button>
            </div>
        );
    }
}

DocumentTitle.propTypes = {
};

DocumentTitle.defaultProps = {
};

export default DocumentTitle;
