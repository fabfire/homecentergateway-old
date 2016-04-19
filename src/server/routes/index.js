var express = require('express');

var probeRepository = require('../models/probeRepository');
var sensorRepository = require('../models/sensorRepository');

module.exports = function (app) {
    var api = '/api';
    app.get(api + '/probes', getProbes);
    app.get(api + '/probesext', getProbesExt);
    app.put(api + '/probe/:id', updateProbe); // /probes/:id

    function getProbes(req, res) {
        console.log('API call : ' + JSON.stringify(req.params) + ' - ' + JSON.stringify(req.body));
        var probes = probeRepository.getProbes();
        res.status(200).send(probes);
    }

    function getProbesExt(req, res) {
        console.log('API call : ' + JSON.stringify(req.params) + ' - ' + JSON.stringify(req.body));
        probeRepository.getProbesExt(function (response) {

            res.status(200).send(response);
        });
    }

    function updateProbe(req, res) {
        console.log('API call : ' + JSON.stringify(req.params) + ' - ' + JSON.stringify(req.body));
        if (isNaN(parseInt(req.params.id))) {
            res.respond(new Error('Id must be a valid integer'), 400);
        } else if ('undefined' !== typeof req.body.id && req.body.id !== req.params.id) {
            res.respond(new Error('Invalid Probe Id'), 400);
        } else {
            probeRepository.updateProbe(req.body, function (probe, err) {
                if (err) {
                    res.status(500).send(err);
                }
                else {
                    res.status(200).send(probe);
                }
            });
        }
    }
};
