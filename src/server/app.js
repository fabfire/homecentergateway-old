/*jshint node:true*/
'use strict';

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var bodyParser = require('body-parser');
var compress = require('compression');
var cors  = require('cors');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var port = process.env.PORT || 7203;

var environment = process.env.NODE_ENV;

//app.use(favicon(__dirname + '/favicon.ico'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(compress());
app.use(logger('dev'));
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

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('event from client', function (data) {
    console.log(data);
  });
});

setInterval(simulateIOPackets, 2000);

function simulateIOPackets() {
   console.log('envoi d\'un packet');
   io.sockets.emit('message', {nodeid:2, temp:25.9, humidity:'45%',data :' le message'});
}