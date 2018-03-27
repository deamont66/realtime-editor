import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';

import Button from 'material-ui/Button';

class LinkButton extends React.Component {

    handleClick = (evt) => {
        const event = evt || window.event;
        if (!event.ctrlKey && !event.metaKey && event.which !== 2) {
            evt.preventDefault();
            this.props.history.push(this.props.to);
        }
        if(this.props.onClick)
            this.props.onClick(evt);
    };

    render() {
        const rest = Object.assign({}, this.props);
        delete rest.to;
        delete rest.onClick;

        return (
            <Button onClick={this.handleClick} {...rest}/>
        );
    }
}

LinkButton.propTypes = {
    to: PropTypes.string.to
};

export default withRouter(LinkButton);
