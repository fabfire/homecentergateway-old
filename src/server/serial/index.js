var config = require('../config');

module.exports = function(logger, io, messageBus) {

    var serialport = require('serialport');
    var environment = config.environment;
    var serial;
    // Load Serialport regarding environment
    switch (environment) {
        case 'build':
            serial = new serialport.SerialPort(config.serialport.prod, {
                baudrate: config.serialport.baudrate,
                parser: serialport.parsers.readline('\r\n')
            });
            break;
        default:
            serial = new serialport.SerialPort(config.serialport.dev, {
                baudrate: config.serialport.baudrate,
                parser: serialport.parsers.readline('\r\n')
            });
            break;
    }

    serial.on('open', function() {
        console.log('Serial port opened');
        logger.log('info', 'Serial port opened');

    });

    serial.on('close', function() {
        console.log('Serial port closed');
        logger.log('info', 'Serial port closed');

    });

    serial.on('data', function(data) {
        data = data + ',"date":' + JSON.stringify(new Date());
        //console.log('Serial data : %s', data);
        logger.info(data);
        //io.sockets.emit('message', data);
        messageBus.emit('data', data); 
    });

    function padStr(i) {
        return (i < 10) ? '0' + i : i;
    }

    serial.on('error', function(e) {
        console.error('Serial communication error : %s', e);
    });

};