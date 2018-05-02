import React from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import withStyles from 'material-ui/styles/withStyles';

import RightMenus from './RightMenus';
import DocumentHeader from './DocumentHeader';

import Error404 from '../Errors/Error404';
import MetaTags from '../../Components/MetaTags';
import RealtimeEditor from "../../RealtimeEditor/RealtimeEditor";

const styles = theme => ({
    root: {
        [theme.breakpoints.up('md')]: {
            margin: -theme.spacing.unit * 3,
        }
    },
    editorBody: {
        borderTop: `1px solid ${theme.palette.grey[300]}`,
    }
});

class SingleDocument extends React.Component {

    render() {
        return (
            <RealtimeEditor user={this.props.user}
                            documentId={this.props.match.params.documentId}
                            headerSlot={(props) => (
                                <div>
                                    <MetaTags title={props.title}/>
                                    <DocumentHeader disconnected={props.disconnected} clientState={props.clientState}
                                                    title={props.title} allowedOperations={props.allowedOperations}
                                                    onSettingsChange={props.onSettingsChange}
                                                    toggleMenu={props.toggleMenu}
                                                    clients={props.clients}
                                    />
                                </div>
                            )}
                            rightMenusSlot={(props) => (
                                <RightMenus documentId={this.props.match.params.documentId}
                                            user={this.props.user}
                                            settings={props.settings}
                                            messages={props.messages}
                                            allowedOperations={props.allowedOperations}
                                            menu={props.menu}
                                            toggleMenu={props.toggleMenu}
                                            onSettingsChange={props.onSettingsChange}
                                            onMessageSubmit={props.onMessageSubmit}
                                            onLoadMoreChatMessage={props.onLoadMoreChatMessage}
                                />
                            )}
                            errorSlot={(props) => {
                                if (props.error === 401) {
                                    return <Redirect to={'/sign-in'}/>;
                                }
                                return <Error404/>;
                            }}
            />
        );

    }
}

SingleDocument.propTypes = {
    user: PropTypes.object,
};

export default withStyles(styles)(SingleDocument);
