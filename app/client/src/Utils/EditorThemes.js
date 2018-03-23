const Themes = {
    'default': 'Default',
    '3024-day': '3024 Day',
    '3024-night': '3024 Night',
    'abcdef': 'Abcdef',
    'ambiance-mobile': 'Ambiance mobile',
    'ambiance': 'Ambiance',
    'base16-dark': 'Base16 Dark',
    'base16-light': 'Base16 Light',
    'bespin': 'Bespin',
    'blackboard': 'Blackboard',
    'cobalt': 'Cobalt',
    'colorforth': 'Colorforth',
    'dracula': 'Dracula',
    'duotone-dark': 'Duotone Dark',
    'duotone-light': 'Duotone Light',
    'eclipse': 'Eclipse',
    'elegant': 'Elegant',
    'erlang-dark': 'Erlang Dark',
    'hopscotch': 'Hopscotch',
    'icecoder': 'Icecoder',
    'isotope': 'Isotope',
    'lesser-dark': 'Lesser Dark',
    'liquibyte': 'LiquiByte',
    'material': 'Material',
    'mbo': 'MBO',
    'mdn-like': 'MDN-like',
    'midnight': 'Midnight',
    'monokai': 'Monokai',
    'neat': 'Neat',
    'neo': 'Neo',
    'night': 'Night',
    'oceanic-next': 'Oceanic Next',
    'panda-syntax': 'Panda Syntax',
    'paraiso-dark': 'Paraiso Dark',
    'paraiso-light': 'Paraiso Light',
    'pastel-on-dark': 'Pastel on Dark',
    'railscasts': 'Railscasts',
    'rubyblue': 'Rubyblue',
    'seti': 'Seti',
    'shadowfox': 'Shadowfox',
    'solarized': 'Solarized',
    'the-matrix': 'The Matrix',
    'tomorrow-night-bright': 'Tomorrow Night Bright',
    'tomorrow-night-eighties': 'Tomorrow Night Eighties',
    'ttcn': 'Ttcn',
    'twilight': 'Twilight',
    'vibrant-ink': 'Vibrant Ink',
    'xq-dark': 'XQ Dark',
    'xq-light': 'XQ Light',
    'yeti': 'Yeti',
    'zenburn': 'Zenburn',
};

module.exports = {
    all: Themes,
    require: () => {
        return new Promise(resolve => {
            require.ensure([], () => {
                Object.keys(Themes).forEach((themeKey) => {
                    if(themeKey !== 'default')
                        require('codemirror/theme/' + themeKey + '.css')
                });
                resolve();
            });
        });
    }
};
