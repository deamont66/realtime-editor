const _Modes = [
    {lang: 'Text (default)', mode: 'null', require: false},
    {lang: 'APL', mode: 'apl', require: true},
    {lang: 'ASN.1', mode: 'asn.1', require: true},
    {lang: 'Asterisk dialplan', mode: 'asterisk', require: true},
    {lang: 'Brainfuck', mode: 'brainfuck', require: true},
    {lang: 'C, C++, C#', mode: 'clike', require: true},
    {lang: 'Ceylon', mode: 'clike', require: true},
    {lang: 'Clojure', mode: 'clojure', require: true},
    {lang: 'Closure Stylesheets (GSS)', mode: 'css', require: true},
    {lang: 'CMake', mode: 'cmake', require: true},
    {lang: 'COBOL', mode: 'cobol', require: true},
    {lang: 'CoffeeScript', mode: 'coffeescript', require: true},
    {lang: 'Common Lisp', mode: 'commonlisp', require: true},
    {lang: 'Crystal', mode: 'crystal', require: true},
    {lang: 'CSS', mode: 'css', require: true},
    {lang: 'Cypher', mode: 'cypher', require: true},
    {lang: 'Cython', mode: 'python', require: true},
    {lang: 'D', mode: 'd', require: true},
    {lang: 'Dart', mode: 'dart', require: true},
    {lang: 'Django (templating language)', mode: 'django', require: true},
    {lang: 'Dockerfile', mode: 'dockerfile', require: true},
    {lang: 'diff', mode: 'diff', require: true},
    {lang: 'DTD', mode: 'dtd', require: true},
    {lang: 'Dylan', mode: 'dylan', require: true},
    {lang: 'EBNF', mode: 'ebnf', require: true},
    {lang: 'ECL', mode: 'ecl', require: true},
    {lang: 'Eiffel', mode: 'eiffel', require: true},
    {lang: 'Elm', mode: 'elm', require: true},
    {lang: 'Erlang', mode: 'erlang', require: true},
    {lang: 'Factor', mode: 'factor', require: true},
    {lang: 'FCL', mode: 'fcl', require: true},
    {lang: 'Forth', mode: 'forth', require: true},
    {lang: 'Fortran', mode: 'fortran', require: true},
    {lang: 'F#', mode: 'mllike', require: true},
    {lang: 'Gas (AT&T-style assembly)', mode: 'gas', require: true},
    {lang: 'Gherkin', mode: 'gherkin', require: true},
    {lang: 'Go', mode: 'go', require: true},
    {lang: 'Groovy', mode: 'groovy', require: true},
    {lang: 'HAML', mode: 'haml', require: true},
    {lang: 'Handlebars', mode: 'handlebars', require: true},
    {lang: 'Haskell', mode: 'haskell', require: true},
    {lang: 'Haskell Literate', mode: 'haskell-literate', require: true},
    {lang: 'Haxe', mode: 'haxe', require: true},
    {lang: 'HTML embedded (JSP, ASP.NET)', mode: 'htmlembedded', require: true},
    {lang: 'HTML mixed-mode', mode: 'htmlmixed', require: true},
    {lang: 'HTTP', mode: 'http', require: true},
    {lang: 'IDL', mode: 'idl', require: true},
    {lang: 'Java', mode: 'clike', require: true},
    {lang: 'JavaScript', mode: 'javascript', require: true},
    {lang: 'JSX', mode: 'jsx', require: true},
    {lang: 'Jinja2', mode: 'jinja2', require: true},
    {lang: 'Julia', mode: 'julia', require: true},
    //{lang: 'Kotlin', mode: 'kotlin', require: true},
    {lang: 'LESS', mode: 'css', require: true},
    {lang: 'LiveScript', mode: 'livescript', require: true},
    {lang: 'Lua', mode: 'lua', require: true},
    {lang: 'Markdown', mode: 'markdown', require: true},
    {lang: 'Markdown GitHub-flavour', mode: 'gfm', require: true},
    {lang: 'Mathematica', mode: 'mathematica', require: true},
    {lang: 'mbox', mode: 'mbox', require: true},
    {lang: 'mIRC', mode: 'mirc', require: true},
    {lang: 'Modelica', mode: 'modelica', require: true},
    {lang: 'MscGen', mode: 'mscgen', require: true},
    {lang: 'MUMPS', mode: 'mumps', require: true},
    {lang: 'Nginx', mode: 'nginx', require: true},
    {lang: 'NSIS', mode: 'nsis', require: true},
    {lang: 'N-Triples/N-Quads', mode: 'ntriples', require: true},
    {lang: 'Objective C', mode: 'clike', require: true},
    {lang: 'OCaml', mode: 'mllike', require: true},
    {lang: 'Octave (MATLAB)', mode: 'octave', require: true},
    {lang: 'Oz', mode: 'oz', require: true},
    {lang: 'Pascal', mode: 'pascal', require: true},
    {lang: 'PEG.js', mode: 'pegjs', require: true},
    {lang: 'Perl', mode: 'perl', require: true},
    {lang: 'PGP (ASCII armor)', mode: 'asciiarmor', require: true},
    {lang: 'PHP', mode: 'php', require: true},
    {lang: 'Pig Latin', mode: 'pig', require: true},
    {lang: 'PowerShell', mode: 'powershell', require: true},
    {lang: 'Properties files', mode: 'properties', require: true},
    {lang: 'ProtoBuf', mode: 'protobuf', require: true},
    {lang: 'Pug', mode: 'pug', require: true},
    {lang: 'Puppet', mode: 'puppet', require: true},
    {lang: 'Python', mode: 'python', require: true},
    {lang: 'Q', mode: 'q', require: true},
    {lang: 'R', mode: 'r', require: true},
    {lang: 'RPM', mode: 'rpm', require: true},
    {lang: 'reStructuredText', mode: 'rst', require: true},
    {lang: 'Ruby', mode: 'ruby', require: true},
    {lang: 'Rust', mode: 'rust', require: true},
    {lang: 'SAS', mode: 'sas', require: true},
    {lang: 'Sass', mode: 'sass', require: true},
    {lang: 'Spreadsheet', mode: 'spreadsheet', require: true},
    {lang: 'Scala', mode: 'clike', require: true},
    {lang: 'Scheme', mode: 'scheme', require: true},
    {lang: 'SCSS', mode: 'css', require: true},
    {lang: 'Shell', mode: 'shell', require: true},
    {lang: 'Sieve', mode: 'sieve', require: true},
    {lang: 'Slim', mode: 'slim', require: true},
    {lang: 'Smalltalk', mode: 'smalltalk', require: true},
    {lang: 'Smarty', mode: 'smarty', require: true},
    {lang: 'Solr', mode: 'solr', require: true},
    {lang: 'Soy', mode: 'soy', require: true},
    {lang: 'Stylus', mode: 'stylus', require: true},
    {lang: 'SQL (several dialects)', mode: 'sql', require: true},
    {lang: 'SPARQL', mode: 'sparql', require: true},
    {lang: 'Squirrel', mode: 'clike', require: true},
    {lang: 'Swift', mode: 'swift', require: true},
    {lang: 'sTeX, LaTeX', mode: 'stex', require: true},
    {lang: 'Tcl', mode: 'tcl', require: true},
    {lang: 'Textile', mode: 'textile', require: true},
    {lang: 'Tiddlywiki', mode: 'tiddlywiki', require: true},
    {lang: 'Tiki wiki', mode: 'tiki', require: true},
    {lang: 'TOML', mode: 'toml', require: true},
    {lang: 'Tornado (templating language)', mode: 'tornado', require: true},
    {lang: 'troff (for manpages)', mode: 'troff', require: true},
    {lang: 'TTCN', mode: 'ttcn', require: true},
    {lang: 'TTCN Configuration', mode: 'ttcn-cfg', require: true},
    {lang: 'Turtle', mode: 'turtle', require: true},
    {lang: 'Twig', mode: 'twig', require: true},
    {lang: 'VB.NET', mode: 'vb', require: true},
    {lang: 'VBScript', mode: 'vbscript', require: true},
    {lang: 'Velocity', mode: 'velocity', require: true},
    {lang: 'Verilog/SystemVerilog', mode: 'verilog', require: true},
    {lang: 'VHDL', mode: 'vhdl', require: true},
    {lang: 'Vue.js app', mode: 'vue', require: true},
    {lang: 'Web IDL', mode: 'webidl', require: true},
    {lang: 'XML/HTML', mode: 'xml', require: true},
    {lang: 'XQuery', mode: 'xquery', require: true},
    {lang: 'Yacas', mode: 'yacas', require: true},
    {lang: 'YAML', mode: 'yaml', require: true},
    {lang: 'YAML frontmatter', mode: 'yaml-frontmatter', require: true},
    {lang: 'Z80', mode: 'z80', require: true},
];


module.exports = {
    all: _Modes,
    require: () => {
        _Modes.forEach((mode) => {
            if(mode.require)
                require('codemirror/mode/' + mode.mode + '/' + mode.mode + '.js');
        });
    }
};
