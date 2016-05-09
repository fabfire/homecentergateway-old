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
    elastic.getSensorsWithLastValue(function (response) {//callback(response);return;
        response.responses[1].aggregations.groupBySensor.buckets.forEach(function (_item) {
            var sensor = _item.last_value.hits.hits[0]._source;
            sensor.name = getSensorName(sensor);
            sensor.mindate = _item.min_value.hits.hits[0]._source.date;
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

var getChartData = function (id, start, end, callback) {
    var startDate = new Date(start);
    var endDate = new Date(end);
    var diff = endDate.getTime() - startDate.getTime();
    var interval;
    // console.log('diff', diff);
    if (diff <= 86400000) // one day
    {
        console.info('one day, returning real values');
        interval = undefined;
    } else if (diff <= 604800000) // one week
    {
        // console.info('one week');
        interval = '5m';
    }
    else if (diff <= 2678400000) // one month
    {
        // console.info('one month');
        interval = '30m';
    }
    else if (diff <= 8035200000) // tree month
    {
        // console.info('tree month');
        interval = '2h';
    }
    else if (diff <= 31536000000) // one year
    {
        // console.info('one year');
        interval = '8h';
    }
    else // more than one year
    {
        // console.info('several years');
        interval = '24h';
    }

    elastic.getChartData(id, startDate, endDate, interval, function (response) {//callback(response);
        //console.log(JSON.stringify(response));
        var all = [];
        // console.log("size", response.aggregations.dataOverTime.buckets.length);
        if (interval !== undefined) {
            response.aggregations.dataOverTime.buckets.forEach(function (_item) {
                all.push([_item.key, _item.avgData.value]);
            });
        }
        else {
            response.hits.hits.forEach(function (_item) {
                all.push([new Date(_item.fields.date[0]).getTime(), _item.fields.value[0]]);
            });
        }
        callback(all);
    });
};
exports.getChartData = getChartData;

var getSensorMeasureId = function (id, date, value, callback) {
    elastic.getSensorMeasureId(id, date, value, function (response) {
        if (response.hits.total === 1) {
            callback(response.hits.hits[0]);
        }
        else { callback({}); }
    });
}
exports.getSensorMeasureId = getSensorMeasureId;

var updateSensorMeasure = function (id, value, callback) {
    elastic.updateSensorMeasure(id, value, function (response) {
        callback(response);
    });
}
exports.updateSensorMeasure = updateSensorMeasure;

