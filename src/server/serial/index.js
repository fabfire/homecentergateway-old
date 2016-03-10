
module.exports = function(logger, io, messageBus) {

    var serialport = require('serialport');
    var environment = process.env.NODE_ENV;
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