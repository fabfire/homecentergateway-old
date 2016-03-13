System.register(['angular2/core', './sensor.service'], function(exports_1, context_1) {
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
    var core_1, sensor_service_1;
    var SensorListComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (sensor_service_1_1) {
                sensor_service_1 = sensor_service_1_1;
            }],
        execute: function() {
            SensorListComponent = (function () {
                function SensorListComponent(_sensorService) {
                    this._sensorService = _sensorService;
                }
                SensorListComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    // Two of doing subscription to observables :
                    // 1 : explicitly subscribe
                    this._sensorService.sensorsData$.subscribe(function (updatedData) { _this.sensorsData = updatedData; });
                    // 2 : bind member and use async pipe into the view, but it doesn't work as expected : the view is not refreshed when the view is reloaded
                    //this.sensorsData$ = this._sensorService.sensorsData$;
                    // add a small animation when a particular sensor is update
                    this._sensorService.sensorUpdated$.subscribe(function (nodeid) {
                        setTimeout(function () {
                            $(".small-box[data-nodeid=" + nodeid + "]").find(".icon").addClass("zoom").delay(800).queue(function () {
                                $(this).removeClass("zoom").dequeue();
                            });
                        }, 200);
                    });
                    this._sensorService.loadSensorInfo();
                };
                SensorListComponent.prototype.routerCanReuse = function (next, prev) { return true; };
                SensorListComponent = __decorate([
                    core_1.Component({
                        selector: 'sensor-list',
                        templateUrl: './app/sensor/sensor-list.component.html'
                    }), 
                    __metadata('design:paramtypes', [sensor_service_1.SensorService])
                ], SensorListComponent);
                return SensorListComponent;
            }());
            exports_1("SensorListComponent", SensorListComponent);
        }
    }
});
//# sourceMappingURL=sensor-list.component.js.map