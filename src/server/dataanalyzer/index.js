var SensorFactory = require('../models/sensorFactory');
var sensorFactory = new SensorFactory();

//TODO : just for test
var first = true;

var analyze = function(data, io) {
    parse(data,
        function(data) {
            var sensors = sensorFactory.createSensor(data);
            sensors.forEach(function(sensor) {
                io.sockets.emit('message', sensor);
                console.log('sensor created : ' + JSON.stringify(sensor));
            });

            //TODO : just for test
            // fake data
            if (first && 'temp' in sensors[0]) {
                for (var i = 4; i < 10; i++) {
                    sensors[0].nodeid = i;
                    io.sockets.emit('message', sensors[0]);
                }
                first = false;
            }
        },
        function() {
            // error parsing data
        });
};

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

    console.log('analyzed data : ' + JSON.stringify(obj));

    if (validData && typeof callback === 'function') {
        callback(obj);
    }
    if (!validData && typeof error === 'function') {
        error();
    }
}

exports.analyze = analyze;