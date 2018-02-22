const http = require('http');

const session = require('./session');
require('./mongoose');
require('./passport');

module.exports = function (port) {
    const express = require('./express')(session.session);
    express.set('port', port);

    const server = http.createServer(express);
    const io = require('socket.io')(server, {
        path: '/api/socket.io',
        serveClient: false,
    });
    require('../src/socketIo')(io, session);

    return server;
};
