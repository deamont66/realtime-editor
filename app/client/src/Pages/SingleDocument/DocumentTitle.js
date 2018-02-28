import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import './DocumentTitle.css';

class DocumentTitle extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            editingTitle: false,
            newTitle: props.title
        };

        this.handleTitleButtonClick = this.handleTitleButtonClick.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            newTitle: nextProps.title
        });
    }

    handleTitleChange(evt) {
        this.setState({
            newTitle: evt.target.value
        });
    }

    handleTitleButtonClick() {
        this.setState((oldState) => {
            if (oldState.editingTitle) {
                this.props.onSettingsChange({title: oldState.newTitle});
            }
            return {
                editingTitle: !oldState.editingTitle,
            };
        });
    }

    render() {
        return (
            <div className="Comp-DocumentTitle">
                {!this.state.editingTitle
                && <h1 onClick={this.handleTitleButtonClick}>{this.props.title}</h1>}

                {this.state.editingTitle
                && <input type="text" value={this.state.newTitle} onChange={this.handleTitleChange}/>}

                <button onClick={this.handleTitleButtonClick} title={this.state.editingTitle ? 'Save title' : 'Edit title'}>
                    <FontAwesomeIcon icon="edit"/>
                    <span className="sr-only">{this.state.editingTitle ? 'Save title' : 'Edit title'}</span>
                </button>
            </div>
        );
    }
}

DocumentTitle.propTypes = {
    onSettingsChange: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
};

DocumentTitle.defaultProps = {
};

export default DocumentTitle;
