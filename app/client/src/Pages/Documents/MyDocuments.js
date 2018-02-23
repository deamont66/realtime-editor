import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from '../../Utils/Axios';
import Loading from "../Components/Loading";

class MyDocuments extends React.Component {
    constructor() {
        super();

        this.state = {
            documents: null
        }
    }

    componentDidMount() {
        this.loadDocuments();
    }

    loadDocuments() {
        axios.get('/document/').then((res) => {
            this.setState({
                documents: res.data
            })
        }).catch((err) => {
            console.log(err);
        });
    }

    render() {
        return (
            <div className="Comp-MyDocuments">
                {this.state.documents === null && <Loading/>}
                {this.state.documents !== null && <ul>
                    {this.state.documents.map((document) => {
                        return (
                            <li key={document._id}>
                                <Link to={'/document/' + document._id}>{document.title}</Link>
                            </li>
                        )
                    })}
                </ul>}

            </div>
        );
    }
}

MyDocuments.propTypes = {};

export default MyDocuments;
