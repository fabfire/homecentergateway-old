System.register(['@angular/core', '@angular/router', './sensor.service', './sensor-chart-component', './utils.service'], function(exports_1, context_1) {
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
    var core_1, router_1, sensor_service_1, sensor_chart_component_1, utils_service_1;
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
            },
            function (sensor_chart_component_1_1) {
                sensor_chart_component_1 = sensor_chart_component_1_1;
            },
            function (utils_service_1_1) {
                utils_service_1 = utils_service_1_1;
            }],
        execute: function() {
            SensorDetailComponent = (function () {
                function SensorDetailComponent(_router, _route, _sensorService, _utilsService) {
                    this._router = _router;
                    this._route = _route;
                    this._sensorService = _sensorService;
                    this._utilsService = _utilsService;
                }
                // routerOnActivate(curr: RouteSegment) {
                //     this.id = curr.getParam('id');
                //    this.type = curr.getParam('type');
                // }
                SensorDetailComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.sub = this._route.params.subscribe(function (params) {
                        _this.id = params['id']; // (+) converts string 'id' to a number
                        _this.type = params['type'];
                    });
                    this.sensorid = this.id;
                    this.sensortype = this.type;
                    // automatically update sensor view when new data comes
                    this.subscription = this._sensorService.sensorUpdated$.subscribe(function (_id) {
                        if (_this.id === _id) {
                            _this.getSensor(_this.id, _this.type);
                        }
                    });
                    this.getSensor(this.id, this.type);
                };
                SensorDetailComponent.prototype.ngOnDestroy = function () {
                    this.subscription.unsubscribe();
                };
                SensorDetailComponent.prototype.save = function () {
                    this._sensorService.updateSensor(this.editSensorData);
                    this._router.navigate(['/']);
                    return false; //to prevent Chrome to submit the form (refresh page)
                };
                SensorDetailComponent.prototype.cancel = function () {
                    this.editSensorData = this.clone(this.sensorData);
                };
                SensorDetailComponent.prototype.getSensor = function (id, type) {
                    this.sensorData = this._sensorService.getSensor(id, type);
                    this.editSensorData = this.clone(this.sensorData);
                    if (this.editSensorData && this.editSensorData.date) {
                        this.lastDate = this.editSensorData.date;
                    }
                };
                SensorDetailComponent.prototype.clone = function (obj) {
                    return Object.assign({}, obj);
                };
                SensorDetailComponent = __decorate([
                    core_1.Component({
                        selector: 'sensor-detail',
                        templateUrl: './app/sensor/sensor-detail.component.html',
                        directives: [sensor_chart_component_1.SensorChartComponent]
                    }), 
                    __metadata('design:paramtypes', [router_1.Router, router_1.ActivatedRoute, sensor_service_1.SensorService, utils_service_1.SensorUtilsService])
                ], SensorDetailComponent);
                return SensorDetailComponent;
            }());
            exports_1("SensorDetailComponent", SensorDetailComponent);
        }
    }
});
//# sourceMappingURL=sensor-detail.component.js.map