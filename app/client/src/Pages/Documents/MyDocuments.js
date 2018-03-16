import React from 'react';
import axios from '../../Utils/Axios';

import withStyles from 'material-ui/styles/withStyles';
import {LinearProgress} from 'material-ui/Progress';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Tooltip from 'material-ui/Tooltip';
import Hidden from 'material-ui/Hidden';

import Add from 'material-ui-icons/Add';

import DocumentTable from "./DocumentTable/DocumentTable";

const styles = theme => ({
    root: {
        [theme.breakpoints.down('sm')]: {
            margin: theme.spacing.unit
        }
    },
    paper: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        marginBottom: 96,
    },
    headline: {
        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing.unit,
        },
    },
    buttonFixed: {
        position: 'fixed',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
    }
});


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

    createNewDocument = (evt) => {
        evt.preventDefault();

        axios.post('/document/').then((res) => {
            this.props.history.push('/document/' + res.data.document);
        }).catch((err) => {
            console.log(err);
        });
    };

    render() {
        const {classes} = this.props;

        return (
            <div>
                <div className={classes.root}>
                    <Typography variant="headline" gutterBottom className={classes.headline}>
                        My documents
                    </Typography>
                    <Typography variant="subheading" component="p">
                        This is list of all documents created by you.
                    </Typography>
                </div>
                <Paper className={classes.paper} elevation={4}>
                    {this.state.documents === null && <LinearProgress/>}
                    {this.state.documents !== null && <DocumentTable documents={this.state.documents}/>}
                </Paper>
                <Tooltip
                    title="Create document"
                    placement={'left'}
                    enterDelay={300}>
                    <Button variant="fab" className={classes.buttonFixed} aria-label="create document"
                            color="secondary"
                            onClick={this.createNewDocument}>
                        <Add/>
                    </Button>
                </Tooltip>
            </div>

        );
    }
}

MyDocuments.propTypes = {};

export default withStyles(styles)(MyDocuments);
