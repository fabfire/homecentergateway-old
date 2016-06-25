var logger = require('../logger/index');
var config = require('../config');

module.exports = function (io, messageBus) {

    var serialport = require('serialport');
    var environment = config.environment;
    var serial;
    //TODO : remove, just form test
    //environment = 'dev';
    // Load Serialport regarding environment

    serial = new serialport.SerialPort(config.serialport.path, {
        baudrate: config.serialport.baudrate,
        parser: serialport.parsers.readline('\r\n')
    });

    serial.on('open', function () {
        console.log('Serial port opened');
        logger.log('info', 'Serial port opened');

    });

    serial.on('close', function () {
        console.log('Serial port closed');
        logger.log('info', 'Serial port closed');

    });

    serial.on('data', function (data) {
        data = data + ',"date":' + JSON.stringify(new Date());
        logger.info(data);
        messageBus.emit('data', data);
    });

    function padStr(i) {
        return (i < 10) ? '0' + i : i;
    }

    serial.on('error', function (e) {
        console.error('Serial communication error : %s', e);
    });

};