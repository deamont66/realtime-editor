import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'material-ui/styles/withStyles';
import {translate} from 'react-i18next';

import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Tooltip from 'material-ui/Tooltip';
import Collapse from 'material-ui/transitions/Collapse';

const styles = theme => ({
    root: {
        marginBottom: theme.spacing.unit * 2
    },
    licence: {
        whiteSpace: 'pre-wrap',
        overflow: 'auto',
        fontFamily: 'monospace',
        marginTop: theme.spacing.unit,
        padding: theme.spacing.unit,
        backgroundColor: theme.palette.background.default
    },
    link: {
        color: (theme.palette.type === 'light') ? theme.palette.secondary.dark : theme.palette.secondary.light
    },
    licenceButton: {
        float: 'right',
    },
    clearfix: {
        clear: 'both'
    }
});

class Licence extends React.Component {
    constructor() {
        super();

        this.state = {
            open: false
        }
    }

    render() {
        const {classes, t, title, url, github, licence, licence_full} = this.props;

        return (
            <div className={classes.root}>
                <Typography variant={'subheading'}>{title}</Typography>
                {(licence || licence_full) && (
                    <Tooltip title={licence_full && t('about.licence_button_text')}>
                        <Button color={'secondary'} className={classes.licenceButton}
                                onClick={() => this.setState(oldState => ({open: !oldState.open}))}>
                            {licence || 'Licence'}
                        </Button>
                    </Tooltip>
                )}
                {url && <Typography variant={'body1'}><a href={url} className={classes.link}>{url}</a></Typography>}
                {github && <Typography variant={'body1'}><a href={github} className={classes.link}>{github}</a></Typography>}
                <div className={classes.clearfix}/>
                {licence_full && (
                    <Collapse in={this.state.open}>
                        <Typography className={classes.licence}>{licence_full}</Typography>
                    </Collapse>
                )}
            </div>
        );
    }
}

Licence.propTypes = {
    title: PropTypes.string.isRequired,
    url: PropTypes.string,
    github: PropTypes.string,
    licence: PropTypes.string,
    licence_full: PropTypes.string
};

export default withStyles(styles)(translate()(Licence));

