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
                    // Observable number ressource for showing update of one sensor
                    this._sensorUpdated = new Rx_1.Subject();
                    // Observable streams
                    this.sensorUpdated$ = this._sensorUpdated.asObservable();
                    this.messageReceived = function (msg) {
                        _this.messages.push(JSON.stringify(msg));
                        if (!msg.hasOwnProperty('msg')) {
                            _this.addSensorInfo(msg);
                        }
                    };
                    this.addSensorInfo = function (data) {
                        //var dateStr = JSON.parse(data.date);
                        data.date = new Date(data.date);
                        var updated = false;
                        // update sensor data if it exists
                        _this._dataStore.sensorData.forEach(function (sensor, i) {
                            if (sensor.nodeid === data.nodeid && sensor.type === data.type) {
                                _this._dataStore.sensorData[i] = data;
                                updated = true;
                            }
                        });
                        // or create it the 1st time
                        if (!updated) {
                            _this._dataStore.sensorData.push(data);
                        }
                        _this._sensorDataObserver.next(_this._dataStore.sensorData);
                        _this.updateSensorInfo(data.nodeid);
                    };
                    this.updateSensorInfo = function (nodeid) {
                        _this._sensorUpdated.next(nodeid);
                    };
                    this.getSensorInfo = function () {
                        console.log('datastore ' + _this._dataStore.sensorData.length);
                        if (_this._dataStore.sensorData.length > 0) {
                            _this._dataStore.sensorData.forEach(function (sensor, i) {
                                _this.updateSensorInfo(sensor.nodeid);
                            });
                        }
                    };
                    this.getMessage = function () {
                        return _this.messages;
                    };
                    // Create Observable Stream to output our data
                    this.sensorsData$ = new Rx_1.Observable(function (observer) { return _this._sensorDataObserver = observer; }).share();
                    this._dataStore = { sensorData: [] };
                }
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