var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var compress = require('compression');
var cors = require('cors');
var morgan = require('morgan');

var config = require('../config');
//var favicon = require('serve-favicon');
var environment = config.environment;

var applyConfiguration = function (app) {

    //app.use(favicon(__dirname + '/favicon.ico'));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    // use morgan to log requests to the console
    app.use(morgan('dev'));

    app.use(compress());
    app.use(cors());

    var session = require('express-session');
    var passport = require('passport');

    // Configure the session and session storage.
    var sessionConfig = {
        resave: false,
        saveUninitialized: false,
        secret: 'irehiruhgtr54654-45987', // config.get('SECRET'),
        signed: true
    };

    app.use(session(sessionConfig));

    // OAuth2
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(require('../auth/oauth2').router);

    // custom routes, this should be placed after body parser
    var routes = require('../routes/index')(app);

    switch (environment) {
        case 'prod':
            console.log('** PROD **');
            app.use(express.static('./build/client')); // only for testing
            app.use(express.static('./'));
            app.use(express.static('./client'));
            app.use('/*', express.static('./client/index.html'));
            break;
        default:
            console.log('** DEV **');
            app.use(express.static('./src/client/'));
            app.use(express.static('./'));
            app.use(express.static('./tmp'));
            app.use(express.static('./test'));
            app.use('/*', express.static('./src/client/index.html'));
            break;
    }
};

exports.applyConfiguration = applyConfiguration;