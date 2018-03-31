import React from 'react';
import withStyles from 'material-ui/styles/withStyles';
import {translate} from 'react-i18next';

import Typography from 'material-ui/Typography';
import {CircularProgress} from 'material-ui/Progress';

import Licence from './Licence';

const styles = theme => ({});

class Licences extends React.Component {
    constructor() {
        super();

        this.state = {
            licences: null
        }
    }

    componentDidMount() {
        import('./licences_data').then((licences) => {
            this.setState({
                licences
            });
        });
    }

    render() {
        const {t} = this.props;
        return (
            <div>
                <Typography variant={'title'} paragraph>{t('about.licences_header')}</Typography>

                {this.state.licences !== null && this.state.licences.map(licence => (
                    <Licence key={licence.title} {...licence}/>
                ))}
                {this.state.licences === null && (
                    <Typography align={'center'} component={'div'}>
                        <CircularProgress color={'secondary'}/>
                    </Typography>
                )}
            </div>
        );
    }
}

export default withStyles(styles)(translate()(Licences));
