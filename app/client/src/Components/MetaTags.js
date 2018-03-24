import React from 'react';
import {translate} from 'react-i18next';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

class MetaTags extends React.Component {

    render() {
        const {t} = this.props;

        return (
            <Helmet titleTemplate={`%s - ${t('app.name')}`} defaultTitle={t('app.name')}>
                {/*-- COMMON TAGS --*/}
                <meta charset="utf-8"/>
                {this.props.title && <title>{this.props.title}</title>}

                {/*-- Search Engine --*/}
                {this.props.description && <meta name="description" content={this.props.description}/>}
                {/*<meta name="image" content="Image"/>*/}

                {/*-- Schema.org for Google --*/}
                {this.props.title && <meta itemProp="name" content={this.props.title}/>}
                {this.props.description && <meta itemProp="description" content={this.props.description}/>}
                {/*<meta itemProp="image" content="Image"/>*/}

                {/*-- Twitter --*/}
                <meta name="twitter:card" content="summary"/>
                {this.props.title && <meta name="twitter:title" content={this.props.title}/>}
                {this.props.description && <meta name="twitter:description" content={this.props.description}/>}
                {/*<meta name="twitter:site" content="@realtime"/>*/}
                {/*<meta name="twitter:image:src" content="Image preview src"/>*/}

                {/*-- Open Graph general (Facebook, Pinterest & Google+) --*/}
                {this.props.title && <meta name="og:title" content={this.props.title}/>}
                {this.props.description && <meta name="og:description" content={this.props.description}/>}
                {/*<meta name="og:image" content="Image preview"/>*/}
                <meta name="og:url" content={window.location.href}/>
                <meta name="og:site_name" content={t('app.name')}/>
                <meta name="og:locale" content="en_Us"/>
                <meta name="fb:admins" content="100000628442315"/>
                <meta name="fb:app_id" content="2043973792282808"/>
                <meta name="og:type" content="website"/>
            </Helmet>
        );
    }
}

MetaTags.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string
};

export default translate()(MetaTags);
