const sharedSession = require("express-socket.io-session");
const passportSocketIo = require('passport.socketio');
const socketIO = require('socket.io');

const RoomList = require('./editor/RoomList');

const initSessionOnNamespace = (io, session) => {
    io.use(sharedSession(session.session, {
        autoSave: true
    }));

    io.use(passportSocketIo.authorize({
        key: 'connect.sid',
        secret: process.env.SESSION_SECRET,
        store: session.sessionStore,
        fail: (data, message, error, accept) => {
            // allow connection even when not authorized
            accept(null, false);
        }
    }));
};

module.exports = function (server, session) {
    const io = socketIO(server, {
        path: '/api/socket.io',
        serveClient: false,
    });

    initSessionOnNamespace(io, session);

    const documentsIO = io.of('/documents');
    initSessionOnNamespace(documentsIO, session);

    new RoomList(documentsIO);
};