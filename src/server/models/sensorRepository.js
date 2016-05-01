var _ = require('lodash');
var elastic = require('../db/elasticsearch');
var probeRepository = require('../models/probeRepository');

// this variable cache sensors data
var sensors = {};

var getSensorName = function (sensor) {
    return probeRepository.getProbeName(sensor.pid);
};
exports.getSensorName = getSensorName;

// when we launch the app, we query the database to get sensors data
var initSensorsFromDB = function (callback) {
    // call ES to fill sensors array
    elastic.getSensors(function (response) {
        response.forEach(function (_sensor) {
            var sensor = {};
            sensor.id = _sensor._id;
            sensor.pid = _sensor.pid;
            sensor.name = getSensorName(sensor);
            sensor.type = _sensor._source.type;
            sensor.description = _sensor._source.description;
            sensors[_sensor._id] = sensor;
        });
        if (callback) {
            callback(_.values(sensors))
        }
    });
};
exports.initSensorsFromDB = initSensorsFromDB;

// getSensors from cache
var getSensors = function (callback) {
    var sensors = {};
    elastic.getSensorsWithLastValue(function (response) {//callback(response);
        response.responses[1].aggregations.groupBySensor.buckets.forEach(function (_item) {
            var sensor = _item.last_value.hits.hits[0]._source;
            sensor.name = getSensorName(sensor);
            sensors[sensor.id] = sensor;
        });
        response.responses[0].hits.hits.forEach(function (_item) {
            sensors[_item._source.id].type = _item._source.type;
        });
        callback(_.values(sensors));
    });
};
exports.getSensors = getSensors;

// each times data comes from a probe, we check if the sensor exists in the cache
// if not, we create the sensor in the DB
var addSensors = function (_sensors) {
    for (var i = 0; i < _sensors.length; i++) {
        var sensor = _sensors[i];
        if (sensor.id && sensors[sensor.id] === undefined) {
            sensors[sensor.id] = sensor;
            // call ES API to add this new sensor
            elastic.addSensor(sensor);
            console.log('create sensor in db : ' + sensor.id);
        }
    }
};
exports.addSensors = addSensors;

var addSensorMeasure = function (sensor) {
    // call ES API to add this new sensor measure
    elastic.addSensorMeasure(sensor);
};
exports.addSensorMeasure = addSensorMeasure;
