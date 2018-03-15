import React from 'react';
import axios from '../../Utils/Axios';
import Loading from "../../Components/Loading";
import DocumentList from "./DocumentList/DocumentList";

class SharedDocuments extends React.Component {
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
        axios.get('/document/shared').then((res) => {
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
                {this.state.documents !== null && <DocumentList documents={this.state.documents}/>}
            </div>
        );
    }
}

SharedDocuments.propTypes = {};

export default SharedDocuments;
