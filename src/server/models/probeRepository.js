var elastic = require('../db/elasticsearch');
var moment = require('moment');
var activesProbes = {};
var allProbes = {};

// each times data comes from a probe, we check if the probe exists in the cache
// if not, we create the probe in the DB
var addProbe = function(probe) {
    if (probe.id && allProbes[probe.id] === undefined) {
        allProbes[probe.id] = probe;
        // call ES API to add this new probe
        elastic.addProbe(probe);
        console.log('create probe in db : ' + probe.id);
    }

};
exports.addProbe = addProbe;

var updateProbe = function(data, callback) {
    if (activesProbes[data.id]) {
        activesProbes[data.id].location = data.location;
    }
    allProbes[data.id].location = data.location;
    // activesProbes[data.id].startdate = data.startdate;
    // activesProbes[data.id].enddate = data.enddate;
    elastic.updateProbe(data, function(result, err) {
        callback(activesProbes[data.id], err);
    });
};
exports.updateProbe = updateProbe;

var getProbes = function(data) {
    return allProbes;
};
exports.getProbes = getProbes;

// when we launch the app, we query the database to get activesProbes data
var initProbesFromDB = function() {
    // call ES to fill sensors array
    elastic.getProbes(function(response) {
        response.forEach(function(_probe) {
            var probe = {};
            probe.id = _probe._id;
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
var checkUnicity = function(data) {
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
                id: data.nodeid,
                lastUpdate: data.date
            };
            activesProbes[data.nodeid] = probe;
            addProbe(probe);
            return true;
        }
    }
};
exports.checkUnicity = checkUnicity;
