var config = {
    port: process.env.PORT || 5000,
    environment: process.env.NODE_ENV || 'dev',
    serialport: {
        path: '/dev/ttyAMA0',
        baudrate: 57600
    },
    pm2webApiUrl: 'http://localhost:9615',
    logDirectory: __dirname + '/logs/',
    logRequest: false,
    google: {
        clientID: '157258009673-9cuuotu5oeai1i6980qs68l0e38196rq.apps.googleusercontent.com',
        clientSecret: 'RS5AUtO8usxM2FMDX-whjWDN',
        callbackURL: 'http://home.tomatosoft.org/auth/google/callback'
    },
    elasticsearch: 'localhost:9200'
};

module.exports = config;