import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from "moment/moment";

class DocumentList extends React.Component {

    render() {
        return (
            <div className="Comp-DocumentList">
                <ul>
                    {this.props.documents.map((document) => {
                        return (
                            <li key={document._id}>
                                <Link to={'/document/' + document._id}>
                                    <span>{document.title} - </span>
                                    <small>{moment(document.lastAccessed || document.lastChange).format('llll')}</small>&nbsp;
                                    {document.from && <small>(shared by {document.from.username})</small>}
                                </Link>
                            </li>
                        )
                    })}
                    {this.props.documents.length === 0 && <li>
                        There are no documents in this list
                    </li>}
                </ul>
            </div>
        );
    }
}

DocumentList.propTypes = {
    documents: PropTypes.array.isRequired,
};

DocumentList.defaultProps = {
    documents: []
};

export default DocumentList;
