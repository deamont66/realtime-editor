import React from 'react';
import Editor from "./Editor/Editor";
import RightMenus from "./RightMenus/RightMenus";
import DocumentTitle from "./DocumentTitle";

import './SingleDocument.css';
import DocumentStore from "../../Stores/DocumentStore";
import Loading from "../Components/Loading";
import DocumentError from "./DocumentError";

class SingleDocument extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            connected: false,
            disconnected: false,
            error: null,

        }
    }

    componentDidMount() {
        DocumentStore.on('connect', () => {
            this.setState({
                connected: true,
                disconnected: false
            });
        });
        DocumentStore.on('disconnect', () => {
            this.setState({
                disconnected: true
            });
        });
        DocumentStore.on('error', (error) => {
            this.setState({
                error: error
            });
        });
        DocumentStore.connect(this.props.match.params.documentId);
    }

    componentWillUnmount() {
        DocumentStore.off('connect');
        DocumentStore.off('disconnect');
        DocumentStore.off('error');
        DocumentStore.disconnect();
    }

    render() {
        if (!this.state.connected)
            return <Loading fullScreen={false}/>;

        if (this.state.error !== null)
            return <DocumentError error={this.state.error}/>;

        return (
            <div className="Comp-SingleDocument">
                <div className="editor-header">
                    <DocumentTitle onChange={(title) => {
                        this.setState({title: title});
                        console.log(title)
                    }} value={this.state.title}/>

                    {this.state.disconnected
                    && <span className="warning text-warning" title="No connection">
                        <i className="fas fa-exclamation-triangle"/>
                        <span className="sr-only">No connection</span>
                    </span>}
                </div>
                <div className="editor-body">
                    <Editor/>
                    <RightMenus/>
                </div>
            </div>
        );
    }
}

SingleDocument.propTypes = {};

export default SingleDocument;
