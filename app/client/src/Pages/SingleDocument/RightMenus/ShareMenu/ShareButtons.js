import React from 'react';
import withStyles from 'material-ui/styles/withStyles';
import Typography from 'material-ui/Typography';

import {
    FacebookShareButton,
    GooglePlusShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    TelegramShareButton,
    RedditShareButton,
    EmailShareButton
} from 'react-share';
import {
    FacebookIcon,
    GooglePlusIcon,
    LinkedinIcon,
    TwitterIcon,
    TelegramIcon,
    RedditIcon,
    EmailIcon
} from 'react-share';

const styles = theme => ({
    shareButton: {
        display: 'inline-block',
        margin: theme.spacing.unit / 2,
        marginTop: theme.spacing.unit,
        cursor: 'pointer'
    }
});

class ShareButtons extends React.Component {

    render() {
        const {classes} = this.props;
        return (
            <Typography align={'center'} component={'div'} paragraph>
                <FacebookShareButton className={classes.shareButton} url={window.location.href}>
                    <FacebookIcon size={32}/>
                </FacebookShareButton>
                <GooglePlusShareButton className={classes.shareButton} url={window.location.href}>
                    <GooglePlusIcon size={32}/>
                </GooglePlusShareButton>
                <LinkedinShareButton className={classes.shareButton} url={window.location.href}>
                    <LinkedinIcon size={32}/>
                </LinkedinShareButton>
                <TwitterShareButton className={classes.shareButton} url={window.location.href}>
                    <TwitterIcon size={32}/>
                </TwitterShareButton>
                <TelegramShareButton className={classes.shareButton} url={window.location.href}>
                    <TelegramIcon size={32}/>
                </TelegramShareButton>
                <RedditShareButton className={classes.shareButton} url={window.location.href}>
                    <RedditIcon size={32}/>
                </RedditShareButton>
                <EmailShareButton className={classes.shareButton} url={window.location.href}>
                    <EmailIcon size={32}/>
                </EmailShareButton>
            </Typography>
        );
    }
}

ShareButtons.propTypes = {};

export default withStyles(styles)(ShareButtons);
