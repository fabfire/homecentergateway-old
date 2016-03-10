var express = require('express');
var app = express();
var server = require('http').Server(app);

var config = require('./server-config');

// Apply the configuration
config.applyConfiguration(app);

module.exports = server;