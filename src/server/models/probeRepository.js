
var elastic = require('../db/elasticsearch');
var moment = require('moment');
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
        callback(activesProbes[data.pid], err);
    });
};
exports.updateProbe = updateProbe;

var getProbes = function (data) {
    return Object.keys(allProbes).map(function (key) { return allProbes[key]; });
};
exports.getProbes = getProbes;

var getProbesExt = function (callback) {
    elastic.getProbesExt(function (response) {
        if (response.responses.length !== 3) {
            return { 'err': 'ko' };
        }
        var probes = {};
        // TODO : use response to send an array of probes with
        // probeid, location count of sensors, count of measures, last VCC
        response.responses[0].hits.hits.forEach(function (_probe) {
            var probe = {};
            probe.pid = _probe._id;
            probe.location = _probe._source.location;
            probes[_probe._id] = probe;
        });
        response.responses[1].aggregations.group_by_probe.buckets.forEach(function (_probe) {
            probes[_probe.key].numberofsensors = _probe.doc_count;
        });
        response.responses[2].aggregations.group_by_probe.buckets.forEach(function (_probe) {
            probes[_probe.key].numberofmeasures = _probe.doc_count;
        });
        callback(probes);
    });
};
exports.getProbesExt = getProbesExt;

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
