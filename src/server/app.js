var logger = require('./logger/index');
var server = require('./server/server');
var io = require('./socket.io/index')(server);

var events = require('events');
var util = require('util');
var messageBus = new events.EventEmitter();
var serialport = require('./serial/index')(logger, io, messageBus);
var config = require('./config');
var analyzer = require('./dataanalyzer/index');

var port = config.port;
var environment = config.environment;

messageBus.on('data', function(data) {
    //console.log('Data received from Serial : ' + data);
    analyzer.analyze(data, io);
});

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