const http = require('http');

const session = require('./session');
require('./mongoose');
require('./passport');

module.exports = function (port) {
    const express = require('./express')(session.session);
    express.set('port', port);

    const server = http.createServer(express);
    require('../src/socketIo')(server, session);

    return server;
};
