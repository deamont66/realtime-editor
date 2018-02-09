const Modes = {
    ada: 'ada',
    apache_conf: 'apache_conf',
    applescript: 'applescript',
    asciidoc: 'asciidoc',
    assembly_x86: 'assembly_x86',
    autohotkey: 'autohotkey',
    batchfile: 'batchfile',
    bro: 'bro',
    c9search: 'c9search',
    c_cpp: 'c_cpp',
    cirru: 'cirru',
    clojure: 'clojure',
    cobol: 'cobol',
    coffee: 'coffee',
    coldfusion: 'coldfusion',
    csharp: 'csharp',
    css: 'css',
    curly: 'curly',
    dart: 'dart',
    django: 'django',
    d: 'd',
    dockerfile: 'dockerfile',
    dot: 'dot',
    drools: 'drools',
    eiffel: 'eiffel',
    ejs: 'ejs',
    elixir: 'elixir',
    elm: 'elm',
    erlang: 'erlang',
    forth: 'forth',
    fortran: 'fortran',
    ftl: 'ftl',
    gcode: 'gcode',
    gherkin: 'gherkin',
    gitignore: 'gitignore',
    glsl: 'glsl',
    gobstones: 'gobstones',
    golang: 'golang',
    groovy: 'groovy',
    haml: 'haml',
    handlebars: 'handlebars',
    haskell_cabal: 'haskell_cabal',
    haskell: 'haskell',
    haxe: 'haxe',
    hjson: 'hjson',
    html_elixir: 'html_elixir',
    html: 'html',
    html_ruby: 'html_ruby',
    ini: 'ini',
    io: 'io',
    jack: 'jack',
    jade: 'jade',
    java: 'java',
    javascript: 'javascript',
    jsoniq: 'jsoniq',
    json: 'json',
    jsp: 'jsp',
    jsx: 'jsx',
    julia: 'julia',
    kotlin: 'kotlin',
    latex: 'latex',
    less: 'less',
    liquid: 'liquid',
    lisp: 'lisp',
    logiql: 'logiql',
    lsl: 'lsl',
    lua: 'lua',
    luapage: 'luapage',
    lucene: 'lucene',
    makefile: 'makefile',
    markdown: 'markdown',
    mask: 'mask',
    matlab: 'matlab',
    maze: 'maze',
    mel: 'mel',
    mushcode: 'mushcode',
    mysql: 'mysql',
    nix: 'nix',
    nsis: 'nsis',
    objectivec: 'objectivec',
    ocaml: 'ocaml',
    pascal: 'pascal',
    perl: 'perl',
    pgsql: 'pgsql',
    php: 'php',
    powershell: 'powershell',
    praat: 'praat',
    prolog: 'prolog',
    properties: 'properties',
    protobuf: 'protobuf',
    python: 'python',
    razor: 'razor',
    rdoc: 'rdoc',
    rhtml: 'rhtml',
    r: 'r',
    rst: 'rst',
    ruby: 'ruby',
    rust: 'rust',
    sass: 'sass',
    scad: 'scad',
    scala: 'scala',
    scheme: 'scheme',
    scss: 'scss',
    sh: 'sh',
    sjs: 'sjs',
    smarty: 'smarty',
    snippets: 'snippets',
    soy_template: 'soy_template',
    space: 'space',
    sql: 'sql',
    sqlserver: 'sqlserver',
    stylus: 'stylus',
    svg: 'svg',
    swift: 'swift',
    tcl: 'tcl',
    tex: 'tex',
    textile: 'textile',
    toml: 'toml',
    tsx: 'tsx',
    twig: 'twig',
    typescript: 'typescript',
    vala: 'vala',
    vbscript: 'vbscript',
    velocity: 'velocity',
    verilog: 'verilog',
    vhdl: 'vhdl',
    wollok: 'wollok',
    xml: 'xml',
    xquery: 'xquery',
    yaml: 'yaml',
    abap: 'abap',
    abc: 'abc',
    actionscript: 'actionscript',
    lean: 'lean',
    live_script: 'live_script',
    livescript: 'livescript',
    mavens_mate_log: 'mavens_mate_log',
    mips_assembler: 'mips_assembler',
    mipsassembler: 'mipsassembler',
    swig: 'swig',
    diff: 'diff',
    plain_text: 'plain_text',
    text: 'text'
};

module.exports = {
    all: Modes,
    require: () => {
        Object.keys(Modes).forEach((modeKey) => {
            require('brace/mode/' + modeKey)
        });
    }
};
