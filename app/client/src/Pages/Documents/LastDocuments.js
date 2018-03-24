import React from 'react';
import {translate} from 'react-i18next';
import axios from '../../Utils/Axios';

import withStyles from 'material-ui/styles/withStyles';
import {LinearProgress} from 'material-ui/Progress';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

import DocumentTable from "./DocumentTable/DocumentTable";
import MetaTags from "../../Components/MetaTags";

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

class LastDocuments extends React.Component {
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
        axios.get('/document/last').then((res) => {
            this.setState({
                documents: res.data
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    render() {
        const {classes, t} = this.props;

        return (
            <div>
                <MetaTags title={t('app.titles.last_documents')}/>
                <div className={classes.root}>
                    <Typography variant="headline" gutterBottom className={classes.headline}>
                        {t('last_documents.headline')}
                    </Typography>
                    <Typography variant="subheading" component="p">
                        {t('last_documents.subheading')}
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

LastDocuments.propTypes = {};

export default translate()(withStyles(styles)(LastDocuments));
