System.register(['@angular/core', '@angular/router', './probe.service', '../pipes/filter-sensor-pipe', '../orderby'], function(exports_1, context_1) {
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
    var core_1, router_1, probe_service_1, filter_sensor_pipe_1, orderby_1;
    var ProbeListComponent;
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
            function (filter_sensor_pipe_1_1) {
                filter_sensor_pipe_1 = filter_sensor_pipe_1_1;
            },
            function (orderby_1_1) {
                orderby_1 = orderby_1_1;
            }],
        execute: function() {
            ProbeListComponent = (function () {
                function ProbeListComponent(router, _probeService) {
                    this.router = router;
                    this._probeService = _probeService;
                }
                ProbeListComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this._probeService.probesList$
                        .subscribe(function (_probes) {
                        _this.probes = _probes;
                        setTimeout(function () {
                            $('.box').hover(function () {
                                $(this).find('.widget-user-header').stop().animate({
                                    'background-position': '20%'
                                }, 800, 'linear');
                            }, function () {
                                $(this).find('.widget-user-header').stop().animate({
                                    'background-position': '0%'
                                }, 800, 'linear');
                            });
                        }, 200);
                    }, console.error);
                    this._probeService.getProbes();
                };
                ProbeListComponent = __decorate([
                    core_1.Component({
                        selector: 'probe-list',
                        templateUrl: './app/sensor/probe-list.component.html',
                        directives: [router_1.ROUTER_DIRECTIVES],
                        pipes: [orderby_1.OrderBy, filter_sensor_pipe_1.FilterPipe]
                    }), 
                    __metadata('design:paramtypes', [router_1.Router, probe_service_1.ProbeService])
                ], ProbeListComponent);
                return ProbeListComponent;
            }());
            exports_1("ProbeListComponent", ProbeListComponent);
        }
    }
});
//# sourceMappingURL=probe-list.component.js.map