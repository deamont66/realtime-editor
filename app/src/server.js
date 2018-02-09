const http = require('http');
const sharedsession = require("express-socket.io-session");

const session = require('./session');

module.exports = function (port) {
    const express = require('./express')(session);

    express.set('port', port);

    const server = http.createServer(express);

    require('./mongoose');

    const io = require('socket.io')(server, {
        path: '/api/socket.io',
        serveClient: false,
    });
    io.use(sharedsession(session));

    require('../src/socketIo')(io);

    return server;
};
