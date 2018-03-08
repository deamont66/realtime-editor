import React from 'react';
import PropTypes from 'prop-types';

class DocumentClients extends React.Component {

    render() {
        return (
            <ul className="Comp-DocumentClients">
                {this.props.clients.filter((s1, pos, arr) => {
                    // removes next records with same name (every username will be shown only once)
                    return arr.findIndex((s2)=>s2.name === s1.name) === pos
                }).map((client) => {
                    return (
                        <li key={client.id} style={{backgroundColor: client.color}}>{client.name || 'Anonymous'}</li>
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
