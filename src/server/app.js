var logger = require('./logger/index');
var server = require('./server/server');
var io = require('./socket.io/index')(server);
var elastic = require('./db/elasticsearch');

var events = require('events');
var util = require('util');
var messageBus = new events.EventEmitter();
var serialport = require('./serial/index')(logger, io, messageBus);
var config = require('./config');
var analyzer = require('./dataanalyzer/index');
var probeRepository = require('./models/probeRepository');
var sensorRepository = require('./models/sensorRepository');

var port = config.port;
var environment = config.environment;

messageBus.on('data', function(data) {
    analyzer.analyze(data, io);
    //TODO : remove fake data
    // if (data.indexOf('msg') === -1) {
    //     console.log("adding fake data to " + data);
    //     var probe1 = data + ',"hum":4512';
    //     var probe2 = data + ',"hum":7423,"pres":999';
    //     analyzer.analyze(probe1, io);
    //     analyzer.analyze(probe2, io);
    // }
});
// TODO : test only
// analyzer.analyze('"nodeid":"3","rx_rssi":"-50",temp:2156,"date":"2016-04-03T14:32:35.487Z"', io);
// analyzer.analyze('"nodeid":"3","rx_rssi":"-50",temp:2389,"date":"2016-04-03T14:32:38.486Z"', io);

console.log('Launching node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

server.listen(port, function() {
    console.log('Express server listening on port ' + port);
    console.log('__dirname = ' + __dirname +
        '\nprocess.cwd = ' + process.cwd());
});

// Elastic search
// elastic.indexExists().then(function(exists) {
//     if (! exists) {
//         return elastic.initIndex();
//     }
// });
// elastic.createTypes();

probeRepository.initProbesFromDB();
sensorRepository.initSensorsFromDB();

/************************************************************** */
/*                               Tests                          */
/************************************************************** */
setTimeout(function() {
    simulateSensorsPackets();
}, 5000);
setInterval(function() {
    simulateSensorsPackets();
}, 30000);

function simulateSensorsPackets() {
    analyzer.analyze('"nodeid":"3","rx_rssi":"-50",temp:2156,hum:4512,vcc:3001,"date":"2016-04-03T20:48:35.487Z"', io);
   //analyzer.analyze('"nodeid":"3","rx_rssi":"-50",temp:2156,hum:4512,vcc:3102,"date":"2016-04-03T14:32:35.487Z"', io);

    // var sensors = [
    //     {
    //         id: '40.1',
    //         value: 20.9,
    //         type: 'temp',
    //         date: new Date()
    //     }, {
    //         id: '40.2',
    //         value: 59.7,
    //         type: 'hum',
    //         date: new Date()
    //     }, {
    //         id: '40.3',
    //         value: 989,
    //         type: 'pres',
    //         date: new Date()
    //     }, {
    //         id:'50.1',
    //         value: 78,
    //         type: 'hum',
    //         date: new Date()
    //     }, {
    //         id: '60.1',
    //         value: 15.1,
    //         type: 'temp',
    //         date: new Date()
    //     }, {
    //         id: '70.1',
    //         value: -10.8,
    //         type: 'temp',
    //         date: new Date()
    //     }, {
    //         id: '80.1',
    //         value: 22.0,
    //         type: 'temp',
    //         date: new Date()
    //     }
    // ];

    // analyzer.addSensors(sensors, io);
}