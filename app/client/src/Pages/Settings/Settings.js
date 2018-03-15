import React from 'react';
import {Switch, Route, Redirect, NavLink, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';

import withStyles from 'material-ui/styles/withStyles'
import Tabs, {Tab} from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import Typography from 'material-ui/Typography';
import Card, {CardContent} from 'material-ui/Card';


import AccountSettings from "./AccountSettings/AccountSettings";
import DefaultDocumentSettings from "./DefaultDocumentSettings/DefaultDocumentSettings";

const styles = theme => ({
    headline: {
        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing.unit,
            marginLeft: theme.spacing.unit,
            marginRight: theme.spacing.unit,
        },
    }
});


class Settings extends React.Component {

    handleTabChange = (evt, value) => {
        const event = evt || window.event;
        if (!event.ctrlKey && !event.metaKey && event.which !== 2) {
            evt.preventDefault();
            this.props.history.push(value);
        }
    };

    render() {
        return (
            <div className="Comp-Settings">
                <Typography variant="headline" gutterBottom className={this.props.classes.headline}>
                    Settings
                </Typography>

                <Card>
                    <AppBar position="static" color="default">
                        <Tabs value={this.props.location.pathname} onChange={this.handleTabChange}>
                            <Tab value={'/settings'} label="Account settings" href={'/settings'}/>
                            <Tab value={'/settings/document'} label="Document settings" href={'/settings/document'}/>
                        </Tabs>
                    </AppBar>
                    <CardContent>
                        <Switch>
                            <Route path={'/settings'} exact render={(props) => (
                                <AccountSettings {...props} user={this.props.user}/>
                            )}/>
                            <Route path={'/settings/document'} exact render={(props) => (
                                <DefaultDocumentSettings {...props} user={this.props.user}/>
                            )}/>

                            <Redirect to={'/settings'}/>
                        </Switch>
                    </CardContent>
                </Card>
            </div>
        );
    }
}

Settings.propTypes = {
    user: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(Settings));
