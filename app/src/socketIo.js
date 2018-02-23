const sharedSession = require("express-socket.io-session");
const passportSocketIo = require('passport.socketio');

const DocumentSocketIOServer = require('./editor/DocumentSocketIOServer');
const RoomList = require('./editor/RoomList');

const roomList = [];

const defaultText = 'Hello world!';

const initSessionOnNamespace = (io, session) => {
    io.use(sharedSession(session.session, {
        autoSave: true
    }));

    io.use(passportSocketIo.authorize({
        key: 'connect.sid',
        secret: process.env.SESSION_SECRET,
        store: session.sessionStore
    }));
};

module.exports = function (io, session) {

    initSessionOnNamespace(io, session);

    const documentsIO = io.of('/documents');
    initSessionOnNamespace(documentsIO, session);

    new RoomList(documentsIO);
};