import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'material-ui/styles/withStyles';

import Grid from 'material-ui/Grid';

import DocumentTitle from "./DocumentTitle";
import DocumentStatus from "./DocumentStatus";
import DocumentClients from "./DocumentClients";

const styles = theme => ({
    root: {
        padding: theme.spacing.unit,
        [theme.breakpoints.up('md')]: {
            paddingLeft: theme.spacing.unit * 3,
            paddingRight: theme.spacing.unit * 3,
        }
    },
    clientsGrid: {
        marginTop: -6
    },
    noWrap: {
        [theme.breakpoints.up('sm')]: {
            whiteSpace: 'nowrap'
        }
    }
});

class DocumentHeader extends React.Component {

    render() {
        const {classes} = this.props;
        return (
            <Grid container className={classes.root}>
                <Grid item xs={12} sm className={classes.noWrap}>
                    <DocumentTitle title={this.props.title}
                                   onSettingsChange={this.props.onSettingsChange}
                                   readOnly={!this.props.allowedOperations.includes('write')}
                    />

                    <DocumentStatus disconnected={this.props.disconnected} state={this.props.clientState}/>
                </Grid>
                <Grid item xs={12} md className={classes.clientsGrid}>
                    <DocumentClients clients={this.props.clients} toggleMenu={this.props.toggleMenu}
                                     allowedOperations={this.props.allowedOperations}/>
                </Grid>
            </Grid>
        );
    }
}

DocumentHeader.propTypes = {
    disconnected: PropTypes.bool.isRequired,
    clientState: PropTypes.string.isRequired,

    title: PropTypes.string.isRequired,
    onSettingsChange: PropTypes.func.isRequired,
    allowedOperations: PropTypes.array.isRequired,
    toggleMenu: PropTypes.func.isRequired,

    clients: PropTypes.array.isRequired
};

export default withStyles(styles)(DocumentHeader);
