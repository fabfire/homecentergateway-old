/*jshint node:true*/
//'use strict';

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var bodyParser = require('body-parser');
var compress = require('compression');
var cors = require('cors');
//var favicon = require('serve-favicon');
var morganLogger = require('morgan');
var winston = require('winston');

var serialport = require('serialport');

var port = process.env.PORT || 7203;

var environment = process.env.NODE_ENV;


var logger = new(winston.Logger)({
    transports: [
        new(winston.transports.File)({
            filename: 'logs.txt'
        })
    ]
});
winston.remove(winston.transports.Console);
//app.use(favicon(__dirname + '/favicon.ico'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(compress());
app.use(morganLogger('dev'));
app.use(cors());

console.log('Launching node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

switch (environment) {
    case 'build':
        console.log('** BUILD **');
        app.use(express.static('./build/'));
        app.use('/*', express.static('./build/index.html'));
        break;
    default:
        console.log('** DEV **');
        app.use(express.static('./src/client/'));
        app.use(express.static('./'));
        app.use(express.static('./tmp'));
        app.use('/*', express.static('./src/client/index.html'));
        break;
}

server.listen(port, function() {
    console.log('Express server listening on port ' + port);
    console.log('env = ' + app.get('env') +
        '\n__dirname = ' + __dirname +
        '\nprocess.cwd = ' + process.cwd());
});

io.on('connection', function(socket) {
    socket.emit('news', {
        hello: 'world'
    });
    socket.on('event from client', function(data) {
        console.log(data);
    });
});

//setInterval(simulateIOPackets, 2000);

// Load Serialport regarding environment
switch (environment) {
    case 'build':
        var serial = new serialport.SerialPort('/dev/ttyAMA0', {
            baudrate: 57600,
            parser: serialport.parsers.readline('\r\n')
        });
        break;
    default:
        var serial = new serialport.SerialPort('COM4', {
            baudrate: 57600,
            parser: serialport.parsers.readline('\r\n')
        });
        break;
}

serial.on('open', function() {
    console.log('Serial port opened');
    logger.log('info', 'Serial port opened');

});

serial.on('data', function(data) {
    console.log('Serial data : %s', data);
    var temp = new Date();
    var dateStr = padStr(temp.getFullYear()) + '-' +
        padStr(1 + temp.getMonth()) + '-' +
        padStr(temp.getDate()) + ' ' +
        padStr(temp.getHours()) + ':' +
        padStr(temp.getMinutes()) + ':' +
        padStr(temp.getSeconds());
    data = dateStr + ';' + data;
    logger.log('info', data);
    io.sockets.emit('message', data);
});

function padStr(i) {
    return (i < 10) ? "0" + i : "" + i;
}

serial.on('error', function(e) {
    console.error('Serial communication error : %s', e);
});

function simulateIOPackets() {
    console.log('envoi d\'un packet');
    io.sockets.emit('message', {
        nodeid: 2,
        temp: 25.9,
        humidity: '45%',
        data: ' le message'
    });
}