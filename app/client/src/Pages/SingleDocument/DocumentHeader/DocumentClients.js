import React from 'react';
import PropTypes from 'prop-types';

class DocumentClients extends React.Component {

    render() {
        return (
            <ul className="Comp-DocumentClients">
                {this.props.clients.map((client) => {
                    return (
                        <li key={client} style={{backgroundColor: client.color}}>{client.name || 'Anonymous'}</li>
                    )
                })}
            </ul>
        );
    }
}

DocumentClients.propTypes = {
    clients: PropTypes.array.isRequired
};

export default DocumentClients;
