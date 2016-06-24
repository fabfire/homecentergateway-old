System.register(['@angular/router', './sensor/probe-list.component', './sensor/probe-detail.component', './sensor/sensor-list.component', './sensor/sensor-detail.component', './console/console.component'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var router_1, probe_list_component_1, probe_detail_component_1, sensor_list_component_1, sensor_detail_component_1, console_component_1;
    var routes, APP_ROUTER_PROVIDERS;
    return {
        setters:[
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (probe_list_component_1_1) {
                probe_list_component_1 = probe_list_component_1_1;
            },
            function (probe_detail_component_1_1) {
                probe_detail_component_1 = probe_detail_component_1_1;
            },
            function (sensor_list_component_1_1) {
                sensor_list_component_1 = sensor_list_component_1_1;
            },
            function (sensor_detail_component_1_1) {
                sensor_detail_component_1 = sensor_detail_component_1_1;
            },
            function (console_component_1_1) {
                console_component_1 = console_component_1_1;
            }],
        execute: function() {
            exports_1("routes", routes = [
                { path: '', component: sensor_list_component_1.SensorListComponent },
                { path: 'sensor/:type/:id', component: sensor_detail_component_1.SensorDetailComponent },
                { path: 'probes', component: probe_list_component_1.ProbeListComponent },
                { path: 'probe/:id', component: probe_detail_component_1.ProbeDetailComponent },
                { path: 'console', component: console_component_1.ConsoleComponent }
            ]);
            exports_1("APP_ROUTER_PROVIDERS", APP_ROUTER_PROVIDERS = [
                router_1.provideRouter(routes)
            ]);
        }
    }
});
//# sourceMappingURL=app.routes.js.map