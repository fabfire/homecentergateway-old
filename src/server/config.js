var config = {
    port: process.env.PORT || 5000,
    environment: process.env.NODE_ENV || 'DEV',
    serialport: {
        dev: 'COM4',
        prod: '/dev/ttyAMA0',
        baudrate: 57600
    },
    pm2webApiUrl: {
        dev: 'http://localhost:3000/test/pm2.json',
        prod: 'http://localhost:9615'
    },
    logDirectory: __dirname + '/logs/'
};

module.exports = config;