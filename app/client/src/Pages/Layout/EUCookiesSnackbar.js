import React from 'react';
import withStyles from 'material-ui/styles/withStyles';
import {translate} from "react-i18next";

import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';

import Done from 'material-ui-icons/Done';
import Book from 'material-ui-icons/Book';

const styles = theme => ({
    close: {
        width: theme.spacing.unit * 4,
        height: theme.spacing.unit * 4,
    }
});

class EUCookiesSnackbar extends React.Component {

    constructor() {
        super();

        this.state = {
            open: localStorage.getItem('EUCookie') === null
        }
    }

    handleClose = () => {
        localStorage.setItem('EUCookie', 'true');
        this.setState({open: false});
    };

    render() {
        const {t, classes} = this.props;

        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={this.state.open}
                SnackbarContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{t('eu_cookies.text')}</span>}
                action={[
                    <Tooltip key="more" title={t('eu_cookies.more_title')}>
                        <IconButton
                            color="inherit"
                            className={classes.close}
                            href={t('eu_cookies.more_link')}
                            target={'_blank'}
                        >
                            <Book/>
                        </IconButton>
                    </Tooltip>,
                    <Tooltip key="close" title={t('eu_cookies.close_title')}>
                        <IconButton
                            color="inherit"
                            className={classes.close}
                            onClick={this.handleClose}
                        >
                            <Done/>
                        </IconButton>
                    </Tooltip>,
                ]}
            />
        );
    }
}

EUCookiesSnackbar.propTypes = {};

export default withStyles(styles)(translate()(EUCookiesSnackbar));
