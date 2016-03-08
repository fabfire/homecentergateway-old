var ProbeFactory = require('../models/probeFactory');
var probeFactory = new ProbeFactory();

var analyze = function(data, io)
{
   parse(data,
        function(data) {
            io.sockets.emit('message', data);
            var probe = probeFactory.createProbe(data);
            
            console.log('probe created : ' + JSON.stringify(probe));
        },
        function(){
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