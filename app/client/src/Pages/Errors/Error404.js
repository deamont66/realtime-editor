import React from 'react';
import {translate} from 'react-i18next';
import Typography from 'material-ui/Typography';
import MetaTags from "../../Components/MetaTags";

const Error404 = (props) => {
    return (
        <div>
            <MetaTags title={props.t('error.not_found')}/>
            <Typography>{props.t('error.not_found')}</Typography>
        </div>
    );
};

export default translate()(Error404);
