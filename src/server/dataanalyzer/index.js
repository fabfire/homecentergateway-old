var ProbeFactory = require('../models/probeFactory');
var probeFactory = new ProbeFactory();

var analyze = function(data, io) {
    parse(data,
        function(data) {
            var probe = probeFactory.createProbe(data);
            io.sockets.emit('message', probe);

            console.log('probe created : ' + JSON.stringify(probe));
            // fake data
            probe.nodeid = 4;
            io.sockets.emit('message', probe);
            probe.nodeid = 5;
            io.sockets.emit('message', probe);
            probe.nodeid = 6;
            io.sockets.emit('message', probe);
            probe.nodeid = 7;
            io.sockets.emit('message', probe);
            probe.nodeid = 8;
            io.sockets.emit('message', probe);

        },
        function() {
            // error parsing data
        });
};

function parse(data, callback, error) {
    var validData = false;
    data = data.replace('/[^a-z0-9 ,-_.?!]/', '');
    data = '{' + data + '}';
    console.log('analyzing data : ' + data);
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