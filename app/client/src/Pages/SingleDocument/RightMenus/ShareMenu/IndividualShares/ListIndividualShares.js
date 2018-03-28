import React from 'react';
import PropTypes from 'prop-types';

import List from 'material-ui/List';

import IndividualShareItem from './IndividualShareItem';

class ListIndividualShares extends React.Component {


    render() {
        const {documentInvites, ...restProps} = this.props;

        return (
            <div>
                <List>
                    {documentInvites.map((documentInvite) => {
                        return (
                            <IndividualShareItem key={documentInvite.to._id}
                                                 documentInvite={documentInvite}
                                                 {...restProps}/>
                        )
                    })}
                </List>
            </div>
        );
    }
}

ListIndividualShares.propTypes = {
    documentInvites: PropTypes.array.isRequired,
    onReload: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    documentId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired
};

export default ListIndividualShares;
