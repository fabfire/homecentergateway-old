var express = require('express');

var probeRepository = require('../models/probeRepository');
var sensorRepository = require('../models/sensorRepository');

module.exports = function (app) {
    var api = '/api';
    app.get(api + '/probes', getProbes);
    app.get(api + '/probeslist', getProbesList);
    app.get(api + '/probesensorsstats/:id', getProbeSensorsStats);
    app.get(api + '/sensorchartdata/:id/:start/:end', getChartData);
    app.get(api + '/sensorchartdata/:id', getChartData);
    app.put(api + '/probe/:id', updateProbe);
    app.get(api + '/sensors', getSensors);

    function getProbes(req, res) {
        console.log('API call : ' + JSON.stringify(req.params) + ' - ' + JSON.stringify(req.body));
        var probes = probeRepository.getProbes();
        res.status(200).send(probes);
    }

    function getSensors(req, res) {
        console.log('API call : ' + JSON.stringify(req.params) + ' - ' + JSON.stringify(req.body));
        var sensors = sensorRepository.getSensors(function (sensors) {
            res.status(200).send(sensors);
        });
    }

    function getProbesList(req, res) {
        console.log('API call : ' + JSON.stringify(req.params) + ' - ' + JSON.stringify(req.body));
        probeRepository.getProbesList(function (response) {

            res.status(200).send(response);
        });
    }

    function getProbeSensorsStats(req, res) {
        console.log('API call : ' + JSON.stringify(req.params) + ' - ' + JSON.stringify(req.body));
        if (isNaN(parseInt(req.params.id))) {
            res.respond(new Error('Id must be a valid integer'), 400);
        } else {
            probeRepository.getProbeSensorsStats(req.params.id, function (probe, err) {
                if (err) {
                    res.status(500).send(err);
                }
                else {
                    res.status(200).send(probe);
                }
            });
        }
    }

    function getChartData(req, res) {
        console.log('API call getChartData : ' + JSON.stringify(req.params) + ' - ' + JSON.stringify(req.body));
        // if (isNaN(parseInt(req.params.id))) {
        //     res.respond(new Error('Id must be a valid integer'), 400);
        // } else {
        var start = req.params.start;
        var end = req.params.end;
        if (undefined === start) start = new Date(2010, 01, 01);
        if (undefined === end) end = new Date();
        probeRepository.getChartData(req.params.id, start, end, function (data, err) {
            if (err) {
                res.status(500).send(err);
            }
            else {
                res.status(200).send(data);
            }
        });
        //}
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
