var express = require('express');

var path = require('path');
var oauth2 = require('../auth/oauth2');
var apiRoutes = require('./apiRoutes');

module.exports = function (app) {
    app.get('/login', function (req, res) {
        res.sendFile(path.join(__dirname + '/../../client/login.html'));
    });
    app.use('/api', oauth2.required, apiRoutes);
    app.get('/', oauth2.required);
};