import React from 'react';
import axios from '../../Utils/Axios';
import Loading from "../../Components/Loading";
import DocumentList from "./DocumentList/DocumentList";

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

    createNewDocument(evt) {
        evt.preventDefault();

        axios.post('/document/').then((res) => {
            this.props.history.push('/document/' + res.data.document);
        }).catch((err) => {
            console.log(err);
        });
    }

    render() {
        return (
            <div className="Comp-MyDocuments">
                <button onClick={this.createNewDocument.bind(this)}>Create new document</button>
                {this.state.documents === null && <Loading/>}
                {this.state.documents !== null && <DocumentList documents={this.state.documents}/>}
            </div>
        );
    }
}

MyDocuments.propTypes = {};

export default MyDocuments;
