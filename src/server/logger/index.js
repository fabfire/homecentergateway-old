var winston = require('winston');
winston.remove(winston.transports.Console);
var config = require('../config');

winston.add(require('winston-daily-rotate-file'), {
    filename: config.logDirectory + '/info',
    maxFiles: 10
});

module.exports = winston;