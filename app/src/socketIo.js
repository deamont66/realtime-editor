const sharedSession = require("express-socket.io-session");

const DocumentSocketIOServer = require('./editor/DocumentSocketIOServer');
const RoomList = require('./editor/RoomList');

const roomList = [];

const defaultText = 'Hello world!';

module.exports = function (io, session) {

    io.use(sharedSession(session.session, {
        autoSave:true
    }));

    const documentsIO = io.of('/documents');

    documentsIO.use(sharedSession(session.session, {
        autoSave:true
    }));
    new RoomList(documentsIO);

    io.on('connection', function (socket) {

        socket.on('joinRoom', function(data) {
            if (!roomList[data.room]) {
                roomList[data.room] = new DocumentSocketIOServer(defaultText, [], data.room, function (socket, cb) {
                    cb(true);
                });
            }
            console.log('client connected: ', data);
            roomList[data.room].addClient(socket);
            roomList[data.room].setName(socket, data.username);

            socket.room = data.room;
            socket.emit('settings', {title: 'Test', theme: 'material', mode: 'javascript', readOnly: false});
        });

        socket.on('chatMessage', function(data) {
            io.to(socket.room).emit('chatMessage', data);
        });

        socket.on('disconnect', function() {
            console.log('client disconnected: ', socket.room);
        });

        socket.on('settings', function (settings) {
            console.log(JSON.stringify(settings));
            io.sockets.emit('settings', settings);
        });

        /*
        console.log(socket.handshake.query.documentId);

        socket.on('value', function (msg) {
            socket.broadcast.emit('value', msg);
        });

        socket.on('init', function (documentId, fn) {
            if (false) { // not found
                fn(null, null, {code: 404, message: 'Document not found'});
            }
            fn({content: 'Hello world!', revision: 0}, {title: 'Test', theme: 'github', mode: 'text', readOnly: false})
        });

        socket.on('settings', function (settings) {
            console.log(JSON.stringify(settings));
            io.sockets.emit('settings', settings);
        }); */
    });
};