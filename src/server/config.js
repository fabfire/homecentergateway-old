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
    logDirectory: __dirname + '/logs/',
    logRequest: false,
    google: {
        clientID: '157258009673-9cuuotu5oeai1i6980qs68l0e38196rq.apps.googleusercontent.com',
        clientSecret: 'RS5AUtO8usxM2FMDX-whjWDN',
        callbackURL: 'http://localhost:3000/auth/google/callback'
    }
};

module.exports = config;