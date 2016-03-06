
var logger = require('./logger/index');

var server = require('./server');
var io = require('./socket.io/index')(server);

var serialport = require('./serial/index')(logger, io);

var port = process.env.PORT || 7203;
var environment = process.env.NODE_ENV;

console.log('Launching node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

server.listen(port, function() {
    console.log('Express server listening on port ' + port);
    console.log('__dirname = ' + __dirname +
        '\nprocess.cwd = ' + process.cwd());
});

/************************************************************** */
function simulateIOPackets() {
    console.log('envoi d\'un packet');
    io.sockets.emit('message', {
        nodeid: 2,
        temp: 25.9,
        humidity: '45%',
        data: ' le message'
    });
}