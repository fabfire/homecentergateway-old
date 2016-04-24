System.register(['angular2/core', './probe.service', './utils.service'], function(exports_1, context_1) {
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
    var core_1, probe_service_1, utils_service_1;
    var SensorChartComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (probe_service_1_1) {
                probe_service_1 = probe_service_1_1;
            },
            function (utils_service_1_1) {
                utils_service_1 = utils_service_1_1;
            }],
        execute: function() {
            SensorChartComponent = (function () {
                function SensorChartComponent(_probeService, _utilsService) {
                    this._probeService = _probeService;
                    this._utilsService = _utilsService;
                }
                SensorChartComponent.prototype.ngOnInit = function () {
                    var lastDate = new Date(this.lastValueDate);
                    var now = moment();
                    if (lastDate > now.subtract(1, 'm')) {
                        console.log('up to date');
                    }
                    else {
                        console.log('not up to date');
                    }
                };
                SensorChartComponent.prototype.routerCanReuse = function (next, prev) { return true; };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], SensorChartComponent.prototype, "sensorid", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], SensorChartComponent.prototype, "lastValueDate", void 0);
                SensorChartComponent = __decorate([
                    core_1.Component({
                        selector: 'sensor-chart',
                        templateUrl: './app/sensor/sensor-chart-component.html'
                    }), 
                    __metadata('design:paramtypes', [probe_service_1.ProbeService, utils_service_1.SensorUtilsService])
                ], SensorChartComponent);
                return SensorChartComponent;
            }());
            exports_1("SensorChartComponent", SensorChartComponent);
        }
    }
});
//# sourceMappingURL=sensor-chart-component.js.map