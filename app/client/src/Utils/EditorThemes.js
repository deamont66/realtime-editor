const Themes = {
    ambiance: 'Ambiance',
    chaos: 'Chaos',
    chrome: 'Chrome',
    clouds: 'Clouds',
    clouds_midnight: 'Clouds Midnight',
    cobalt: 'Cobalt',
    crimson_editor: 'Crimson Editor',
    dawn: 'Dawn',
    dreamweaver: 'Dreamweaver',
    eclipse: 'Eclipse',
    github: 'Github',
    idle_fingers: 'Idle Fingers',
    iplastic: 'Iplastic',
    katzenmilch: 'Katzenmilch',
    kr_theme: 'Kr Theme',
    kuroir: 'Kuroir',
    merbivore: 'Merbivore',
    merbivore_soft: 'Merbivore Soft',
    mono_industrial: 'Mono Industrial',
    monokai: 'Monokai',
    pastel_on_dark: 'Pastel on Dark',
    solarized_dark: 'Solarized Dark',
    solarized_light: 'Solarized Light',
    sqlserver: 'SQLServer',
    terminal: 'Terminal',
    textmate: 'Textmate',
    tomorrow: 'Tomorrow',
    tomorrow_night: 'Tomorrow Night',
    tomorrow_night_blue: 'Tomorrow Night Blue',
    tomorrow_night_bright: 'Tomorrow Night Bright',
    tomorrow_night_eighties: 'Tomorrow Night Eighties',
    twilight: 'Twilight',
    vibrant_ink: 'Vibrant Ink',
    xcode: 'xCode'
};

module.exports = {
    all: Themes,
    require: () => {
        Object.keys(Themes).forEach((themeKey) => {
            require('brace/theme/' + themeKey)
        });
    }
};
