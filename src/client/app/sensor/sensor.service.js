System.register(['angular2/core', 'rxjs/Rx'], function(exports_1, context_1) {
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
    var core_1, Rx_1;
    var SensorService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Rx_1_1) {
                Rx_1 = Rx_1_1;
            }],
        execute: function() {
            SensorService = (function () {
                function SensorService() {
                    var _this = this;
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
                    this.updateSensor = function (data) {
                        data.date = new Date(data.date);
                        var updated = false;
                        // update sensor data if it exists
                        _this._dataStore.sensorData.forEach(function (sensor, i) {
                            if (sensor.id === data.id && sensor.type === data.type) {
                                _this._dataStore.sensorData[i] = data;
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
                    this.getMessage = function () {
                        return _this.messages;
                    };
                    // Create Observable Stream to output our data
                    this.sensorsData$ = new Rx_1.Observable(function (observer) { return _this._sensorDataObserver = observer; }).share();
                    this._dataStore = { sensorData: [] };
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
                    __metadata('design:paramtypes', [])
                ], SensorService);
                return SensorService;
            }());
            exports_1("SensorService", SensorService);
        }
    }
});
//# sourceMappingURL=sensor.service.js.map