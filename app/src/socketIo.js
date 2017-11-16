module.exports = function (io) {
    io.on('connection', function(socket){
        socket.on('value', function(msg){
            socket.broadcast.emit('value', msg);
        });
    });
};