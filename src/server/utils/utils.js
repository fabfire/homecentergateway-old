var async = require('async');
var request = require('request');
var elastic = require('../db/elasticsearch');
var config = require('../config');

var getStatus = function (callback) {
    async.parallel(
        {
            nodejs: function (callback) {
                callback(null, {
                    status: 'green'
                });
            },
            elastic: function (callback) {
                pingES(
                    function (err, response) {
                        var resultES;
                        if (err) {
                            resultES = {
                                status: 'red',
                                message: err.message
                            };
                        }
                        else {
                            resultES = {
                                status: 'green'
                            };
                        }
                        callback(null, resultES);
                    }
                );
            },
            // web health api on port 9615
            pm2: function (callback) {
                var url = (config.environment === 'prod' ? config.pm2webApiUrl.prod : config.pm2webApiUrl.dev);

                request(url, function (error, response, body) {
                    var resultPM2;
                    if (!error && response.statusCode === 200) {
                        var info = JSON.parse(body);
                        resultPM2 = {
                            status: 'green',
                            message: {
                                system_info: info.system_info,
                            }
                        };
                        resultPM2.message.processes = [];
                        if (info.processes) {
                            info.processes.forEach(function (process, i) {
                                resultPM2.message.processes[i] = {};
                                resultPM2.message.processes[i].name = process.pm2_env.name;
                                resultPM2.message.processes[i].port = process.pm2_env.PORT;
                                resultPM2.message.processes[i].status = process.pm2_env.status;
                                resultPM2.message.processes[i].restart_time = process.pm2_env.restart_time;
                            });
                        }
                    }
                    else {
                        resultPM2 = {
                            status: 'red',
                            message: error
                        };
                    }
                    callback(null, resultPM2);
                })
            }
        },
        function (err, results) {
            // results is now equals to: {one: 1, two: 2}
            results.date = new Date();
            callback(err, results);
        }
    );
}
exports.getStatus = getStatus;

var pingES = function (callback) {
    elastic.pingES(function (err, response) {
        callback(err, response);
    });
};
exports.pingES = pingES;
