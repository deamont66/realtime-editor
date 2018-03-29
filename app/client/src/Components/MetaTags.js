import React from 'react';
import {translate} from 'react-i18next';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

/**
 * Defines only changing meta tags.
 * @see {@link /app/src/utils/generateMetaTags|All meta tags generated on server}
 */
class MetaTags extends React.Component {

    render() {
        const {t} = this.props;

        return (
            <Helmet titleTemplate={`%s - ${t('app.name')}`} defaultTitle={t('app.name')}>
                {/*-- COMMON TAGS --*/}
                {this.props.title && <title>{this.props.title}</title>}

                {/*-- Search Engine --*/}
                {this.props.description && <meta name="description" content={this.props.description}/>}
                {/*<meta name="image" content="Image"/>*/}

                {/*-- Schema.org for Google --*/}
                {this.props.title && <meta itemProp="name" content={this.props.title}/>}
                {this.props.description && <meta itemProp="description" content={this.props.description}/>}
                {/*<meta itemProp="image" content="Image"/>*/}

                {/*-- Twitter --*/}
                {this.props.title && <meta name="twitter:title" content={this.props.title}/>}
                {this.props.description && <meta name="twitter:description" content={this.props.description}/>}
                {/*<meta name="twitter:site" content="@realtime"/>*/}
                {/*<meta name="twitter:image:src" content="Image preview src"/>*/}

                {/*-- Open Graph general (Facebook, Pinterest & Google+) --*/}
                {this.props.title && <meta property="og:title" content={this.props.title}/>}
                {this.props.description && <meta property="og:description" content={this.props.description}/>}
                {/*<meta name="og:image" content="Image preview"/>*/}
                <meta name="og:url" content={window.location.href}/>
            </Helmet>
        );
    }
}

MetaTags.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string
};

export default translate()(MetaTags);
