import React from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import withStyles from 'material-ui/styles/withStyles';

import Typography from 'material-ui/Typography';
import {CircularProgress} from 'material-ui/Progress';

import LinkRights from "./LinkRights/LinkRights";
import axios from "../../../../Utils/Axios";
import IndividualShares from "./IndividualShares/IndividualShares";


const styles = theme => ({
    title: {
        fontWeight: 500
    },
});

class ShareMenu extends React.Component {

    constructor() {
        super();

        this.state = {
            shareLinkRights: null,
            documentInvites: [],
        };
    }

    componentDidMount() {
        this.loadRights();
    }

    loadRights = () => {
        axios.get('/document/' + this.props.documentId + '/rights').then((res) => {
            this.setState({
                shareLinkRights: res.data.shareLinkRights,
                documentInvites: res.data.documentInvites
            });
        }).catch(err => {
            console.error(err);
            this.props.onClose();
        });
    };

    render() {
        const {classes, t, allowedOperations} = this.props;

        if (!allowedOperations.includes('share')) return null;

        return (
            <div>
                <Typography className={classes.title} variant={'subheading'}
                            component={'h2'}>{t('share_menu.title')}</Typography>

                {this.state.shareLinkRights === null && (
                    <Typography align={'center'} component={'div'}>
                        <CircularProgress/>
                    </Typography>
                )}
                {this.state.shareLinkRights !== null && (
                    <LinkRights shareLinkRights={this.state.shareLinkRights}
                                documentId={this.props.documentId}
                                onClose={this.props.onClose}
                                onReload={this.loadRights}
                    />
                )}

                {this.state.shareLinkRights !== null && (
                    <IndividualShares documentId={this.props.documentId}
                                      documentInvites={this.state.documentInvites}
                                      onClose={this.props.onClose}
                                      onReload={this.loadRights}
                    />
                )}
            </div>
        );
    }


    /*return (

            <hr/>
            <div>

            </div>

        </div>
    );*/

}

ShareMenu.propTypes = {
    onClose: PropTypes.func.isRequired,
    documentId: PropTypes.string.isRequired,
};

ShareMenu.defaultProps = {
    onClose: () => {
    }
};

export default withStyles(styles)(translate()(ShareMenu));
