const translate = require('../langs/en');

const fastEscape = (text) => {
    return text.replace(/&/g, '&amp;').
    replace(/</g, '&lt;').  // it's not neccessary to escape >
    replace(/"/g, '&quot;').
    replace(/'/g, '&#039;');
};

const generate = (url, title, description) => {
    let rawtitle = fastEscape(translate['app']['name']);
    if (title) {
        rawtitle = fastEscape(`${title} - ${rawtitle}`);
    }
    let rawDescription = fastEscape(translate['app']['description']);
    if (description) {
        rawDescription = fastEscape(description);
    }
    let rawUrl = fastEscape(url);
    return [
        /*-- COMMON TAGS --*/
        `<title>${rawtitle}</title>`,
        `<meta charset="utf-8">`,
        `<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">`,
        `<meta name="theme-color" content="#000000">`,

        /*-- Search Engine --*/
        `<meta name="description" content="${rawDescription}">`,
        /*`<meta name="image" content="Image">`*/

        /*-- Schema.org for Google --*/
        `<meta itemProp="name" content="${rawtitle}">`,
        `<meta itemProp="description" content="${rawDescription}">`,
        /*`<meta itemProp="image" content="Image">`*/

        /*-- Twitter --*/
        `<meta name="twitter:card" content="summary">`,
        `<meta name="twitter:title" content="${rawtitle}">`,
        `<meta name="twitter:description" content="${rawDescription}">`,
        /*<meta name="twitter:site" content="@realtime">*/
        /*<meta name="twitter:image:src" content="Image preview src">*/

        /*-- Open Graph general (Facebook, Pinterest & Google+) --*/
        `<meta name="og:title" content="${rawtitle}">`,
        `<meta name="og:description" content="${rawDescription}">`,
        /*<meta name="og:image" content="Image preview"/>*/
        `<meta name="og:url" content="${rawUrl}">`,
        `<meta name="og:site_name" content="${translate['app']['name']}">`,
        `<meta name="og:locale" content="en_Us">`,
        `<meta name="fb:admins" content="100000628442315">`,
        `<meta name="fb:app_id" content="2043973792282808">`,
        `<meta name="og:type" content="website">`
    ].join('');
};

module.exports = generate;