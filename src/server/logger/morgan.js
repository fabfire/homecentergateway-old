var morgan = require('morgan');
var FileStreamRotator = require('file-stream-rotator')
var config = require('../config');

module.exports = function (app) {
    // morgan request logger
    // create a rotating write stream
    var accessLogStream = FileStreamRotator.getStream({
        date_format: 'YYYYMMDD',
        filename: config.logDirectory + '/access-%DATE%.log',
        frequency: 'daily',
        verbose: false
    });

    morgan.token('user', function (req, res) { return (req.user ? req.user.email : 'anonymous'); })
    if (config.environment === 'dev' && config.logRequest) {
        app.use(morgan('dev', {
            skip: function (req, res) {
                return (/\.(png|jpg|gif|css|jpeg|ico|map|woff2)$/).test(req.path);
            }
        }));
    } else {
        app.use(morgan(':remote-addr - [:date[iso]] ":method :url :status :res[content-length] :user', {
            skip: function (req, res) {
                return (/\.(png|jpg|gif|css|jpeg|ico|js|map|woff2)$/).test(req.path);
            },
            stream: accessLogStream
        }));
    }
    return morgan;
};