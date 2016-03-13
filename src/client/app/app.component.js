System.register(['angular2/core', './layout/main-header.component', './layout/main-sidebar.component', './layout/main-content.component', './layout/main-footer.component', './layout/control-sidebar.component', 'angular2/router', './sensor/sensor-list.component', './sensor/sensor-detail.component', './console/console.component', './sensor/sensor.service'], function(exports_1, context_1) {
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
    var core_1, main_header_component_1, main_sidebar_component_1, main_content_component_1, main_footer_component_1, control_sidebar_component_1, router_1, sensor_list_component_1, sensor_detail_component_1, console_component_1, sensor_service_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (main_header_component_1_1) {
                main_header_component_1 = main_header_component_1_1;
            },
            function (main_sidebar_component_1_1) {
                main_sidebar_component_1 = main_sidebar_component_1_1;
            },
            function (main_content_component_1_1) {
                main_content_component_1 = main_content_component_1_1;
            },
            function (main_footer_component_1_1) {
                main_footer_component_1 = main_footer_component_1_1;
            },
            function (control_sidebar_component_1_1) {
                control_sidebar_component_1 = control_sidebar_component_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (sensor_list_component_1_1) {
                sensor_list_component_1 = sensor_list_component_1_1;
            },
            function (sensor_detail_component_1_1) {
                sensor_detail_component_1 = sensor_detail_component_1_1;
            },
            function (console_component_1_1) {
                console_component_1 = console_component_1_1;
            },
            function (sensor_service_1_1) {
                sensor_service_1 = sensor_service_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(_sensorService) {
                    this._sensorService = _sensorService;
                }
                AppComponent.prototype.ngAfterViewInit = function () {
                    //Initialize theme AdminLTE.
                    loadAdminLTE();
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'homecenter',
                        templateUrl: './app/app.component.html',
                        directives: [main_header_component_1.MainHeaderComponent, main_sidebar_component_1.MainSidebarComponent, main_content_component_1.MainContentComponent, main_footer_component_1.MainFooterComponent, control_sidebar_component_1.ControlSidebarComponent],
                        providers: [router_1.ROUTER_PROVIDERS, sensor_service_1.SensorService]
                    }),
                    router_1.RouteConfig([
                        { path: '/', name: 'Sensors', component: sensor_list_component_1.SensorListComponent, useAsDefault: true },
                        { path: '/sensor/:type/:id', name: 'SensorDetail', component: sensor_detail_component_1.SensorDetailComponent },
                        { path: '/console', name: 'Console', component: console_component_1.ConsoleComponent }
                    ]), 
                    __metadata('design:paramtypes', [sensor_service_1.SensorService])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map