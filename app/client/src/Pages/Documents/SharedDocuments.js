import React from 'react';
import axios from '../../Utils/Axios';

import withStyles from 'material-ui/styles/withStyles';
import {LinearProgress} from 'material-ui/Progress';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

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
        [theme.breakpoints.down('sm')]: {
            marginBottom: 96,
        }
    },
    headline: {
        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing.unit,
        },
    },
});

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
        const {classes} = this.props;

        return (
            <div>
                <div className={classes.root}>
                    <Typography variant="headline" gutterBottom className={classes.headline}>
                        Shared documents
                    </Typography>
                    <Typography variant="subheading" component="p">
                        This is list of all documents somebody shared directly with you.
                    </Typography>
                </div>
                <Paper className={classes.paper} elevation={4}>
                    {this.state.documents === null && <LinearProgress/>}
                    {this.state.documents !== null && <DocumentTable documents={this.state.documents}/>}
                </Paper>
            </div>
        );
    }
}

SharedDocuments.propTypes = {};

export default withStyles(styles)(SharedDocuments);
