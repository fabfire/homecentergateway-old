System.register(['@angular/core', '../sensor/utils.service'], function(exports_1, context_1) {
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
    var core_1, utils_service_1;
    var $this, ControlSidebarComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (utils_service_1_1) {
                utils_service_1 = utils_service_1_1;
            }],
        execute: function() {
            ControlSidebarComponent = (function () {
                function ControlSidebarComponent(_utilsService) {
                    this._utilsService = _utilsService;
                }
                ControlSidebarComponent.prototype.ngOnInit = function () {
                    $this = this;
                    this.checkStatus();
                    setInterval(function () {
                        $this.checkStatus();
                    }, 60000);
                };
                ControlSidebarComponent.prototype.checkStatus = function () {
                    var _this = this;
                    this._utilsService.getStatus().subscribe(function (data) {
                        _this.status = data;
                        if (data.pm2.message.system_info && data.pm2.message.system_info.uptime) {
                            _this.status.pm2.message.system_info.uptime = moment.duration(data.pm2.message.system_info.uptime * 1000).humanize();
                        }
                        if (data.nodejs.status !== 'green') {
                            toastr.error('Serveur NodeJS indisponible !');
                        }
                        else if (_this.previousStatus && _this.previousStatus.nodejs.status !== 'green') {
                            toastr.success('Serveur NodeJS en ligne !');
                        }
                        if (data.elastic.status !== 'green') {
                            toastr.error('Serveur ElasticSearch indisponible !');
                        }
                        else if (_this.previousStatus && _this.previousStatus.elastic.status !== 'green') {
                            toastr.success('Serveur ElasticSearch en ligne !');
                        }
                        if (data.pm2.status !== 'green') {
                            toastr.error('Monitoring PM2 indisponible !');
                        }
                        else if (_this.previousStatus && _this.previousStatus.pm2.status !== 'green') {
                            toastr.success('Monitoring PM2 en ligne !');
                        }
                        _this.previousStatus = _this.status;
                    }, function (err) {
                        _this.status = undefined;
                        toastr.error('Serveur NodeJS indisponible !', '', {
                            "closeButton": true,
                            "preventDuplicates": true,
                            "positionClass": "toast-bottom-right",
                            "hideDuration": "0",
                            "timeOut": "0",
                        });
                    });
                };
                ControlSidebarComponent = __decorate([
                    core_1.Component({
                        selector: 'control-sidebar',
                        templateUrl: './app/layout/control-sidebar.component.html'
                    }), 
                    __metadata('design:paramtypes', [utils_service_1.SensorUtilsService])
                ], ControlSidebarComponent);
                return ControlSidebarComponent;
            }());
            exports_1("ControlSidebarComponent", ControlSidebarComponent);
        }
    }
});
//# sourceMappingURL=control-sidebar.component.js.map