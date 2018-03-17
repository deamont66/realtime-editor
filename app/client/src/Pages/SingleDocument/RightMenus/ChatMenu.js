import React from 'react';
import PropTypes from 'prop-types';

class ChatMenu extends React.Component {

    constructor() {
        super();

        this.state = {
            message: ''
        }
    }

    handleMessageChange(evt) {
        this.setState({
            message: evt.target.value
        })
    }

    handleMessageSubmit(evt) {
        evt.preventDefault();

        if (this.state.message) {
            this.props.onMessageSubmit(this.state.message, () => {
                this.setState({
                    message: ''
                });
            });
        }
    }

    render() {
        return (
            <div className="Comp-ShareMenu">
                <button onClick={this.props.onClose}>Close</button>


                <ul>
                    {this.props.messages.map((message) => {
                        return (
                            <li key={message._id} title={message.date}><span style={{color: message.user.color.dark}}>{message.user.username}</span> - {message.message}</li>
                        )
                    })}
                    {this.props.messages.length === 0 && <li>Napište první zprávu</li>}
                </ul>

                <form onSubmit={this.handleMessageSubmit.bind(this)} className="form-group">
                    <input type="text" value={this.state.message} onChange={this.handleMessageChange.bind(this)}/>
                    <button type="submit">Odeslat</button>
                </form>
            </div>
        );
    }
}

ChatMenu.propTypes = {
    messages: PropTypes.array.isRequired,
    onMessageSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

ChatMenu.defaultProps = {
    onClose: () => {
    }
};

export default ChatMenu
