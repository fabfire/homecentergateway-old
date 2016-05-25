var express = require('express');
var oauth2 = require('../auth/oauth2');
var apiRoutes = require('./apiRoutes');

module.exports = function (app) {
    app.use('/api', oauth2.required, apiRoutes);
    app.get('/', oauth2.required);
};