System.register(['@angular/core', '@angular/router', './sensor.service', '../orderby', '../pipes/filter-sensor-pipe'], function(exports_1, context_1) {
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
    var core_1, router_1, sensor_service_1, orderby_1, filter_sensor_pipe_1;
    var SensorListComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (sensor_service_1_1) {
                sensor_service_1 = sensor_service_1_1;
            },
            function (orderby_1_1) {
                orderby_1 = orderby_1_1;
            },
            function (filter_sensor_pipe_1_1) {
                filter_sensor_pipe_1 = filter_sensor_pipe_1_1;
            }],
        execute: function() {
            SensorListComponent = (function () {
                function SensorListComponent(router, _sensorService, cd) {
                    this.router = router;
                    this._sensorService = _sensorService;
                    this.cd = cd;
                }
                SensorListComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    // Two ways of doing subscription to observables :
                    // 1 : explicitly subscribe
                    this.listSubscription = this._sensorService.sensorsData$.subscribe(function (updatedData) {
                        _this.sensorsData = updatedData;
                        _this.limitDate = moment().subtract(1, 'hour');
                        // this.cd.markForCheck(); // marks path
                    });
                    // 2 : bind member and use async pipe into the view, but it doesn't work as expected : the view is not refreshed when the view is reloaded
                    //this.sensorsData$ = this._sensorService.sensorsData$;
                    // add a small animation when a particular sensor is update
                    this.animationSubscription = this._sensorService.sensorUpdated$.subscribe(function (id) {
                        setTimeout(function () {
                            $(".small-box[data-id='" + id + "']").find(".icon").addClass("zoom").delay(1000).queue(function () {
                                $(this).removeClass("zoom").dequeue();
                            });
                        }, 200);
                    });
                    this._sensorService.getSensors();
                };
                SensorListComponent.prototype.ngOnDestroy = function () {
                    this.listSubscription.unsubscribe();
                    this.animationSubscription.unsubscribe();
                };
                SensorListComponent = __decorate([
                    core_1.Component({
                        selector: 'sensor-list',
                        templateUrl: './app/sensor/sensor-list.component.html',
                        directives: [router_1.ROUTER_DIRECTIVES],
                        pipes: [orderby_1.OrderBy, filter_sensor_pipe_1.FilterPipe]
                    }), 
                    __metadata('design:paramtypes', [router_1.Router, sensor_service_1.SensorService, core_1.ChangeDetectorRef])
                ], SensorListComponent);
                return SensorListComponent;
            }());
            exports_1("SensorListComponent", SensorListComponent);
        }
    }
});
//# sourceMappingURL=sensor-list.component.js.map