module.exports = function (io) {

    io.on('connection', function (socket) {

        console.log(socket.handshake.query.documentId);

        socket.on('value', function (msg) {
            socket.broadcast.emit('value', msg);
        });

        socket.on('init', function (fn) {
            if (/* not found*/ false) {
                fn(null, null, {code: 404, message: 'Document not found'});
            }
            fn({content: 'Hello world!', revision: 0}, {title: 'Test'})
        })
    });
};