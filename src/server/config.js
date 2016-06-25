var environment = process.env.NODE_ENV || 'dev';

if (environment === 'prod') {
    var config = require('./config.prod');
}
else {
    var config = require('./config.dev');
}

module.exports = config;