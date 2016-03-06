var express = require('express');
var app = express();
var server = require('http').Server(app);

var config = require('./config');

// Apply the configuration
config.applyConfiguration(app);

module.exports = server;