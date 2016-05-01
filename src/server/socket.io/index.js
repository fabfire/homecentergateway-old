module.exports = function(server) {
    var io = require('socket.io')(server, {
    allowUpgrades: true,
    transports: ['websocket', 'flashsocket', 'polling']
}); 
    
    io.on('connection', function(socket) {
        socket.emit('new client', 'client connecté');
        socket.on('event from client', function(data) {
            console.log(data);
        });
    });
    
    return io;
};