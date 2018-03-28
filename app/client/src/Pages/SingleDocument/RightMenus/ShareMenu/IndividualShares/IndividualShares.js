import React from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import withStyles from 'material-ui/styles/withStyles';

import Typography from 'material-ui/Typography';
import AddIndividualShare from './AddIndividualShare';
import ListIndividualShares from './ListIndividualShares';

const styles = theme => ({
   title: {
       marginTop: theme.spacing.unit,
       marginBottom: theme.spacing.unit / 2,
   },
});

class IndividualShares extends React.Component {

    constructor() {
        super();

        this.state = {
            value: {
                username: '',
                rights: 1
            }
        };
    }

    handleChange = (value) => {
        this.setState({value});
    };
    handleUpdate = (username, rights) => {
        this.handleChange({username, rights});
    };

    render() {
        const {t, classes} = this.props;

        return (
            <div style={{position: 'relative'}}>
                <Typography variant={'subheading'} component={'h3'} className={classes.title}>
                    {t('individual_shares.title')}
                </Typography>

                <AddIndividualShare documentId={this.props.documentId}
                                    onReload={this.props.onReload}
                                    onClose={this.props.onClose}
                                    value={this.state.value} onChange={this.handleChange}

                />

                <ListIndividualShares documentId={this.props.documentId}
                                      documentInvites={this.props.documentInvites}
                                      onReload={this.props.onReload}
                                      onClose={this.props.onClose}
                                      onUpdate={this.handleUpdate}
                />

            </div>
        );
    }
}

IndividualShares.propTypes = {
    documentInvites: PropTypes.array.isRequired,
    onReload: PropTypes.func.isRequired,
    documentId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired
};

export default withStyles(styles)(translate()(IndividualShares));
