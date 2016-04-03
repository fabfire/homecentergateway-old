System.register(['angular2/core', 'angular2/router', './sensor.service'], function(exports_1, context_1) {
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
    var core_1, router_1, sensor_service_1;
    var SensorDetailComponent;
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
            }],
        execute: function() {
            SensorDetailComponent = (function () {
                function SensorDetailComponent(_router, _routeParams, _sensorService) {
                    this._router = _router;
                    this._routeParams = _routeParams;
                    this._sensorService = _sensorService;
                }
                SensorDetailComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    var id = this._routeParams.get('id');
                    var type = this._routeParams.get('type');
                    // automatically update sensor view when new data comes
                    this.subscription = this._sensorService.sensorUpdated$.subscribe(function (_id) {
                        if (id === _id) {
                            _this.getSensor(id, type);
                        }
                    });
                    this.getSensor(id, type);
                };
                SensorDetailComponent.prototype.ngOnDestroy = function () {
                    this.subscription.unsubscribe();
                };
                SensorDetailComponent.prototype.routerCanReuse = function (next, prev) { return true; };
                SensorDetailComponent.prototype.save = function () {
                    this._sensorService.updateSensor(this.editSensorData);
                    this._router.navigate(['/Sensors']);
                    return false; //to prevent Chrome to submit the form (refresh page)
                };
                SensorDetailComponent.prototype.cancel = function () {
                    this.editSensorData = this.clone(this.sensorData);
                };
                SensorDetailComponent.prototype.getSensor = function (id, type) {
                    this.sensorData = this._sensorService.getSensor(id, type);
                    this.editSensorData = this.clone(this.sensorData);
                };
                SensorDetailComponent.prototype.clone = function (obj) {
                    return Object.assign({}, obj);
                };
                SensorDetailComponent = __decorate([
                    core_1.Component({
                        selector: 'sensor-detail',
                        templateUrl: './app/sensor/sensor-detail.component.html'
                    }), 
                    __metadata('design:paramtypes', [router_1.Router, router_1.RouteParams, sensor_service_1.SensorService])
                ], SensorDetailComponent);
                return SensorDetailComponent;
            }());
            exports_1("SensorDetailComponent", SensorDetailComponent);
        }
    }
});
//# sourceMappingURL=sensor-detail.component.js.map