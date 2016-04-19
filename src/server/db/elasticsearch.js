var elasticsearch = require('elasticsearch');
var elasticClient = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'info'
});

var indexName = 'homecenter';

/**
* Delete an existing index
*/
function deleteIndex() {
    console.log('elastic : Deleting index : ' + indexName);
    return elasticClient.indices.delete({
        index: indexName
    });
}
exports.deleteIndex = deleteIndex;

/**
* create the index
*/
function initIndex() {
    console.log('elastic : Creating index : ' + indexName);
    return elasticClient.indices.create({
        index: indexName
    });
}
exports.initIndex = initIndex;

/**
* check if the index exists
*/
function indexExists() {
    console.log('elastic : Exists index : ' + indexName);
    return elasticClient.indices.exists({
        index: indexName
    });
}
exports.indexExists = indexExists;

// ping ES
function pingES() {
    elasticClient.ping({
        // ping usually has a 3000ms timeout 
        //requestTimeout: Infinity,

        // undocumented params are appended to the query string 
        hello: '"elasticsearch!'
    }, function(error) {
        if (error) {
            console.trace('elastic : elasticsearch cluster is down!\n');
        } else {
            console.log('elastic : elasticsearch cluster is UP !!!\n');
        }
    });

    elasticClient.info(function(err, response, status) {
        if (err) {
            console.trace('elastic : error gathering info on cluster');
        } else {
            // console.log(response);
        }
    });
}
exports.pingES = pingES;

function createTypes() {
    // probe location table
    elasticClient.indices.putMapping(
        {
            index: indexName,
            type: 'probelocation',
            body: {
                properties: {
                    pid: { type: 'string' },
                    startdate: { type: 'date' },
                    enddate: { type: 'date' }
                }
            }
        },
        function(err, response, status) {
            if (err) {
                console.trace('elastic : error creating type Probelocation \n' + err);
            }
            else {
                console.log('elastic : type creation successfull : Probelocation');
            }
        }
    );

    // sensors table
    elasticClient.indices.putMapping(
        {
            index: indexName,
            type: 'sensors',
            body: {
                properties: {
                    id: { type: 'string' },
                    pid: { type: 'string' },
                    type: { type: 'string' },
                    description: { type: 'string' }
                }
            }
        },
        function(err, response, status) {
            if (err) {
                console.trace('elastic : error creating type Sensors \n' + err);
            }
            else {
                console.log('elastic : type creation successfull : Sensors');
            }
        }
    );

    // sensors measures table
    elasticClient.indices.putMapping(
        {
            index: indexName,
            type: 'sensorsmeasures',
            body: {
                properties: {
                    id: { type: 'string' },
                    pid: { type: 'string' },
                    date: { type: 'date' },
                    value: { type: 'short' }
                }
            }
        },
        function(err, response, status) {
            if (err) {
                console.trace('elastic : error creating type Sensors measures \n' + err);
            }
            else {
                console.log('elastic : type creation successfull : sensorsmeasures');
            }
        }
    );
}
exports.createTypes = createTypes;

function addSensor(sensor) {
    elasticClient.create({
        index: indexName,
        type: 'sensors',
        id: sensor.id,
        body: {
            id: sensor.id,
            pid:sensor.pid,
            type: sensor.type
        }
    }, function(err, response) {
        if (err) {
            console.error('elastic : error creating sensor \n' + err);
        }
    });
}
exports.addSensor = addSensor;

function addProbe(probe) {
    elasticClient.create({
        index: indexName,
        type: 'probelocation',
        id: probe.pid,
        body: {
            pid: probe.pid,
            location: probe.location,
            startdate: probe.startdate,
            enddate: probe.enddate
        }
    }, function(err, response) {
        if (err) {
            console.error('elastic : error creating probe \n' + err);
        }
    });
}
exports.addProbe = addProbe;

function addSensorMeasure(sensor) {
    elasticClient.index({
        index: indexName,
        type: 'sensorsmeasures',
        body: {
            id: sensor.id.toString(),
            pid:sensor.pid,
            date: sensor.date,
            value: sensor.value
        }
    }, function(err, response) {
        if (err) {
            console.error('elastic : error adding sensor measure\n' + err);
        }
    });
}
exports.addSensorMeasure = addSensorMeasure;

function getSensors(callback) {
    elasticClient.search({
        index: indexName,
        type: 'sensors'
    }, function(err, response) {
        if (err) {
            console.error('elastic : error getting sensors \n' + err);
        }
        else {
            callback(response.hits.hits);
        }
    });
}
exports.getSensors = getSensors;

function getProbes(callback) {
    elasticClient.search({
        index: indexName,
        type: 'probelocation'
    }, function(err, response) {
        if (err) {
            console.error('elastic : error getting probes \n' + err);
        }
        else {
            callback(response.hits.hits);
        }
    });
}
exports.getProbes = getProbes;

function getProbesExt(callback) {
    elasticClient.msearch({
        body:[
            // Probelocation
            {index: indexName, type: 'probelocation'},
            {query: {match_all: {}}},
            // Sensors
            {index: indexName, type: 'sensors'},
            {
                aggs: {
                    group_by_probe: {
                        terms: {
                            field: 'pid'
                        }
                    }
                }
            },
            // SensorsMeasures
            {index: indexName, type: 'sensorsmeasures'},
            {
                size:0,
                aggs: {
                    group_by_probe: {
                        terms: {
                            field: 'pid'
                        },
                        aggs: {
                            group_by_sensor: {
                                terms: {
                                    field: 'id'
                                },                            
                                aggs:{
                                    last_value:{
                                        top_hits:{
                                            size:1,
                                            sort: {'date': {order: 'desc'}}
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
        ]    
    },
    function(err, response) {
        if (err) {
            console.error('elastic : error getting probes \n' + err);
        }
        else {
            //console.info(JSON.stringify(response));
            callback(response);
        }
    });
}
exports.getProbesExt = getProbesExt;

function updateProbe(probe, callback) {
    elasticClient.update({
        index: indexName,
        type: 'probelocation',
        id: probe.pid,
        body: {
            doc: { // put the partial document under the `doc` key
                location: probe.location
            }
        }
    }, function(err, response) {
        if (err) {
            console.error('elastic : error updating probe \n' + err);
        }
        else {
            callback(response);
        }
    });
}
exports.updateProbe = updateProbe;