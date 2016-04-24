System.register(['angular2/core', 'angular2/router', './probe.service', './utils.service'], function(exports_1, context_1) {
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
    var core_1, router_1, probe_service_1, utils_service_1;
    var ProbeDetailComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (probe_service_1_1) {
                probe_service_1 = probe_service_1_1;
            },
            function (utils_service_1_1) {
                utils_service_1 = utils_service_1_1;
            }],
        execute: function() {
            ProbeDetailComponent = (function () {
                function ProbeDetailComponent(_router, _routeParams, _probeService, _utilsService) {
                    this._router = _router;
                    this._routeParams = _routeParams;
                    this._probeService = _probeService;
                    this._utilsService = _utilsService;
                }
                ProbeDetailComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    console.log('detail ngOnInit');
                    var id = this._routeParams.get('id');
                    // automatically update sensor view when new data comes
                    // this.subscription = this._probeService.probeUpdated$.subscribe(
                    //     _id => {
                    //         if (id === _id) {
                    //             this.getProbe(id);
                    //         }
                    //     });
                    this.getProbe(id);
                    this._probeService.getProbeDetail(id).subscribe(function (updatedData) { console.log(updatedData); _this.probeDetailedData = updatedData; });
                };
                ProbeDetailComponent.prototype.routerCanReuse = function (next, prev) { return true; };
                ProbeDetailComponent.prototype.getProbe = function (id) {
                    this.probeData = this._probeService.getProbe(id);
                    this.editProbeData = this.clone(this.probeData);
                };
                ProbeDetailComponent.prototype.clone = function (obj) {
                    return Object.assign({}, obj);
                };
                ProbeDetailComponent = __decorate([
                    core_1.Component({
                        selector: 'probe-detail',
                        templateUrl: './app/sensor/probe-detail.component.html',
                        directives: [router_1.ROUTER_DIRECTIVES],
                    }), 
                    __metadata('design:paramtypes', [router_1.Router, router_1.RouteParams, probe_service_1.ProbeService, utils_service_1.SensorUtilsService])
                ], ProbeDetailComponent);
                return ProbeDetailComponent;
            }());
            exports_1("ProbeDetailComponent", ProbeDetailComponent);
        }
    }
});
//# sourceMappingURL=probe-detail.component.js.map