
var elastic = require('../db/elasticsearch');
var moment = require('moment');
var _ = require('lodash');

var activesProbes = {};
var allProbes = {};

// each times data comes from a probe, we check if the probe exists in the cache
// if not, we create the probe in the DB
var addProbe = function (probe) {
    if (probe.pid && allProbes[probe.pid] === undefined) {
        allProbes[probe.pid] = probe;
        // call ES API to add this new probe
        elastic.addProbe(probe);
        console.log('create probe in db : ' + probe.pid);
    }

};
exports.addProbe = addProbe;

var updateProbe = function (data, callback) {
    // console.info(JSON.stringify(activesProbes));
    // console.info(JSON.stringify(allProbes));
    if (activesProbes[data.pid]) {
        activesProbes[data.pid].location = data.location;
    }
    allProbes[data.pid].location = data.location;
    // activesProbes[data.pid].startdate = data.startdate;
    // activesProbes[data.pid].enddate = data.enddate;
    elastic.updateProbe(data, function (result, err) {
        callback(allProbes[data.pid], err);
    });
};
exports.updateProbe = updateProbe;

var getProbes = function (data) {
    return Object.keys(allProbes).map(function (key) { return allProbes[key]; });
};
exports.getProbes = getProbes;

var getProbesList = function (callback) {
    elastic.getProbesExt(function (response) {//callback(response);
        if (response.responses.length !== 3) {
            return { 'err': 'ko' };
        }
        var probes = {};
        // return array of probes with probeid, location, count of sensors, count of measures, last VCC
        response.responses[0].hits.hits.forEach(function (_probe) {
            var probe = {};
            probe.pid = _probe._id;
            probe.location = _probe._source.location;
            probe.image = _probe._source.image;
            probes[_probe._id] = probe;
        });
        response.responses[1].aggregations.groupByProbe.buckets.forEach(function (_probe) {
            probes[_probe.key].numberofsensors = _probe.doc_count;
            if (_probe.vccByProbe.vccSensor.hits.hits.length > 0) {
                probes[_probe.key].vccSensorId = _probe.vccByProbe.vccSensor.hits.hits[0]._id;
            }
        });
        response.responses[2].aggregations.groupByProbe.buckets.forEach(function (_probe) {
            probes[_probe.key].numberofmeasures = _probe.doc_count;
            if (probes[_probe.key].vccSensorId) {
                var vccSensor = _.find(_probe.groupBySensor.buckets, { 'key': '' + probes[_probe.key].vccSensorId + '' });
                probes[_probe.key].vcc = vccSensor.last_value.hits.hits[0]._source.value;
                delete probes[_probe.key].vccSensorId;
            }
        });
        callback(Object.keys(probes).map(function (key) { return probes[key]; }));
    });
};
exports.getProbesList = getProbesList;

var getProbeSensorsStats = function (id, callback) {
    elastic.getProbeSensorsStats(id, function (response) {//callback(response);
        var probe = {
            pid: id,
            sensorstats: {}
        };
        response.responses[0].hits.hits.forEach(function (_sensor) {
            var sensor = {};
            sensor.id = _sensor._id;
            sensor.type = _sensor._source.type;
            probe.sensorstats[sensor.id] = {};
            probe.sensorstats[sensor.id].sensordata = sensor;
        });
        response.responses[1].aggregations.groupBySensor.buckets.forEach(function (_sensor) {
            probe.sensorstats[_sensor.key].count = _sensor.doc_count;
        });
        probe.sensorstats = Object.keys(probe.sensorstats).map(function (key) { return probe.sensorstats[key]; })
        callback(probe);
    });
};
exports.getProbeSensorsStats = getProbeSensorsStats;

var getProbeName = function (id) {
    if (allProbes[id]) {
        return allProbes[id].location;
    }
};
exports.getProbeName = getProbeName;

// when we launch the app, we query the database to get activesProbes data
var initProbesFromDB = function () {
    // call ES to fill sensors array
    elastic.getProbes(function (response) {
        response.forEach(function (_probe) {
            var probe = {};
            probe.pid = _probe._id;
            probe.location = _probe._source.location;
            probe.startdate = _probe._source.startdate;
            probe.enddate = _probe._source.enddate;
            allProbes[_probe._id] = probe;
        });
    });
};
exports.initProbesFromDB = initProbesFromDB;

// Sometimes, sensors send same packets 2 or 3 times.
// if the packet is the same than the previous one (1-2 sec before), we skip it
var checkUnicity = function (data) {
    if (data && data.date) {
        var currentDate = moment(data.date);
        currentDate = currentDate.add(-3, 'seconds');
        // console.log('data : ' + data);

        if (activesProbes[data.nodeid] && moment(activesProbes[data.nodeid].lastUpdate) > currentDate && data.msg === undefined) {
            var previousDate = moment(activesProbes[data.nodeid].lastUpdate);
            // skip it because it's the same than previous value
            // console.log('prev date : ' + previousDate.toString());
            // console.log('skip : ' + JSON.stringify(data));
            // console.log('activesProbes : ' + JSON.stringify(activesProbes));
            return false;
        }
        else {
            var probe = {
                pid: data.nodeid,
                lastUpdate: data.date
            };
            activesProbes[data.nodeid] = probe;
            addProbe(probe);
            return true;
        }
    }
};
exports.checkUnicity = checkUnicity;
