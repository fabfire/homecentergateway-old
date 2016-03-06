//var morganLogger = require('morgan');
var winston = require('winston');
winston.remove(winston.transports.Console);

winston.add(require('winston-daily-rotate-file'), {
    filename: 'logs',
    maxFiles: 20
});

module.exports = winston;