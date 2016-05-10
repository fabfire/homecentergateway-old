System.register(['angular2/core', 'angular2/http', 'rxjs/Rx', './probe.service'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, http_1, Rx_1, probe_service_1;
    var SensorService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (Rx_1_1) {
                Rx_1 = Rx_1_1;
            },
            function (probe_service_1_1) {
                probe_service_1 = probe_service_1_1;
            }],
        execute: function() {
            SensorService = (function () {
                function SensorService(probeService, http) {
                    var _this = this;
                    this.probeService = probeService;
                    this.http = http;
                    this.messages = [];
                    // Observable string ressource for showing update of one sensor
                    this._sensorUpdated = new Rx_1.Subject();
                    // Observable streams
                    this.sensorUpdated$ = this._sensorUpdated.asObservable();
                    this.messageReceived = function (msg) {
                        _this.messages.push(JSON.stringify(msg));
                        if (!msg.hasOwnProperty('msg')) {
                            _this.updateSensor(msg);
                        }
                    };
                    this.getSensors = function () {
                        _this.http.get("api/sensors")
                            .map(function (response) { return response.json(); })
                            .subscribe(function (sensors) {
                            sensors.forEach(function (sensor) {
                                _this.updateSensor(sensor);
                            });
                        });
                    };
                    this.updateSensor = function (data) {
                        data.date = new Date(data.date);
                        if (data.mindate) {
                            data.mindate = new Date(data.mindate);
                        }
                        var updated = false;
                        // update sensor data if it exists
                        _this._dataStore.sensorData.forEach(function (sensor, i) {
                            if (!updated && sensor.id === data.id && sensor.type === data.type) {
                                // Location changed, call the BO
                                if (_this._dataStore.sensorData[i].name !== data.name) {
                                    // call probe.service to update probe location
                                    var probe = {
                                        pid: data.pid,
                                        location: data.name
                                    };
                                    _this.probeService.updateProbe(probe);
                                    _this.updateSensorsName(probe.pid, probe.location);
                                }
                                _this._dataStore.sensorData[i].date = data.date;
                                _this._dataStore.sensorData[i].value = data.value;
                                _this._dataStore.sensorData[i].name = data.name;
                                updated = true;
                            }
                        });
                        // or create it the 1st time
                        if (!updated) {
                            _this._dataStore.sensorData.push(data);
                        }
                        if (_this._sensorDataObserver != undefined) {
                            _this._sensorDataObserver.next(_this._dataStore.sensorData);
                        }
                        _this.sensorUpdated(data.id);
                    };
                    this.sensorUpdated = function (id) {
                        _this._sensorUpdated.next(id);
                    };
                    this.loadSensorInfo = function () {
                        _this._sensorDataObserver.next(_this._dataStore.sensorData);
                    };
                    this.updateSensorsName = function (probeId, name) {
                        _this._dataStore.sensorData.forEach(function (sensor, i) {
                            if (sensor.id.startsWith(probeId + '.')) {
                                sensor.name = name;
                            }
                        });
                    };
                    this.getMessage = function () {
                        return _this.messages;
                    };
                    this.getChartData = function (id, start, end) {
                        return _this.http.get("api/sensorchartdata/" + id + (start === '' ? '' : '/' + start + '/' + end))
                            .map(function (response) { return response.json(); });
                        // Test file
                        // return this.http.get('a.json');
                    };
                    this.getSensorMeasureId = function (id, date, value) {
                        var body = {
                            id: id,
                            date: date,
                            value: value
                        };
                        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
                        var options = new http_1.RequestOptions({ headers: headers });
                        return _this.http.post("api/getsensormeasureid/", JSON.stringify(body), options)
                            .map(function (response) { return response.json(); });
                    };
                    this.updateMeasure = function (id, value) {
                        var body = {
                            id: id,
                            value: value
                        };
                        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
                        var options = new http_1.RequestOptions({ headers: headers });
                        return _this.http.put("api/updatesensormeasure/", JSON.stringify(body), options)
                            .map(function (response) { return response.json(); });
                    };
                    this.deleteMeasure = function (id) {
                        return _this.http.delete("api/deletesensormeasure/" + id)
                            .map(function (response) { return response.json(); });
                    };
                    // Create Observable Stream to output our data
                    this.sensorsData$ = new Rx_1.Observable(function (observer) { return _this._sensorDataObserver = observer; }).share();
                    this._dataStore = { sensorData: [] };
                    this.probeService = probeService;
                }
                SensorService.prototype.getSensor = function (id, type) {
                    var foundSensor;
                    this._dataStore.sensorData.some(function (sensor, i) {
                        if (sensor.id === id && sensor.type === type) {
                            foundSensor = sensor;
                            return true;
                        }
                    });
                    return foundSensor;
                };
                SensorService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [probe_service_1.ProbeService, http_1.Http])
                ], SensorService);
                return SensorService;
            }());
            exports_1("SensorService", SensorService);
        }
    }
});
//# sourceMappingURL=sensor.service.js.map