var express = require('express');
var bodyParser = require('body-parser');
var compress = require('compression');
var cors = require('cors');
//var favicon = require('serve-favicon');
var environment = process.env.NODE_ENV;

var applyConfiguration = function(app) {

    //app.use(favicon(__dirname + '/favicon.ico'));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(compress());
    app.use(cors());

    switch (environment) {
        case 'build':
            console.log('** BUILD **');
            app.use('/*', express.static('./client/index.html'));
            app.use(express.static('./build/client')); // only for testing
            app.use(express.static('./'));
            app.use(express.static('./client'));
            break;
        default:
            console.log('** DEV **');
            app.use(express.static('./src/client/'));
            app.use(express.static('./'));
            app.use(express.static('./tmp'));
            app.use('/*', express.static('./src/client/index.html'));
            break;
    }
};

exports.applyConfiguration = applyConfiguration;