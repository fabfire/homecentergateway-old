var sensorFactory = require('../models/sensorFactory');
var ProbeRepository = require('../models/probeRepository');
var probeRepository = new ProbeRepository();
var SensorRepository = require('../models/sensorRepository');

var addSensors = function(sensors, io) {
    SensorRepository.addSensors(sensors);
    sensors.forEach(function(sensor) {
        if (sensor.id) {
            SensorRepository.addSensorMeasure(sensor);
        }
        io.sockets.emit('message', sensor);
        console.log('sensor sent : ' + JSON.stringify(sensor));
    });
};
exports.addSensors = addSensors;

var analyze = function(data, io) {
    parse(data,
        function(data) {
            // check if the message has been already sent and skip it.
            if (probeRepository.checkUnicity(data)) {
                var sensors = sensorFactory.createSensor(data);
                addSensors(sensors, io);
            }
        },
        function() {
            // error parsing data
        });
};
exports.analyze = analyze;

function parse(data, callback, error) {
    var validData = false;
    data = data.replace('/[^a-z0-9 ,-_.?!]/', '');
    data = '{' + data + '}';
    //console.log('analyzing data : ' + data);
    var obj;
    try {
        obj = JSON.parse(JSON.stringify(eval('(' + data + ')')));
        if ('temp' in obj && obj.temp === 8500) {
            delete obj.temp;
        }
        validData = true;
    } catch (err) {
        console.log('error analyzing data.');
    }

    //console.log('analyzed data : ' + JSON.stringify(obj));

    if (validData && typeof callback === 'function') {
        callback(obj);
    }
    if (!validData && typeof error === 'function') {
        error();
    }
}

