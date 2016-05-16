System.register(['@angular/core', '@angular/http'], function(exports_1, context_1) {
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
    var core_1, http_1;
    var SensorUtilsService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            }],
        execute: function() {
            SensorUtilsService = (function () {
                function SensorUtilsService(http) {
                    var _this = this;
                    this.http = http;
                    this.getStatus = function () {
                        return _this.http.get("api/getstatus")
                            .map(function (response) { return response.json(); });
                    };
                    this.getTypeLabel = function (type) {
                        var str;
                        switch (type) {
                            case "temp":
                                str = "Température";
                                break;
                            case "hum":
                                str = "Humidité";
                                break;
                            case "pres":
                                str = "Pression";
                                break;
                            case "vcc":
                                str = "VCC";
                                break;
                            default:
                                str = type;
                                break;
                        }
                        ;
                        return str;
                    };
                    this.getTypeColor = function (type) {
                        var str;
                        switch (type) {
                            case "temp":
                                str = "bg-yellow";
                                break;
                            case "hum":
                                str = "bg-aqua";
                                break;
                            case "pres":
                                str = "bg-green";
                                break;
                            case "vcc":
                                str = "bg-red";
                                break;
                        }
                        ;
                        return str;
                    };
                    this.getTypeAxisLabel = function (type) {
                        var str;
                        switch (type) {
                            case "temp":
                                str = "Temperature (°C)";
                                break;
                            case "hum":
                                str = "Humidité (%)";
                                break;
                            case "pres":
                                str = "Pression (mb)";
                                break;
                            case "vcc":
                                str = "Voltage (V)";
                                break;
                        }
                        ;
                        return str;
                    };
                }
                SensorUtilsService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], SensorUtilsService);
                return SensorUtilsService;
            }());
            exports_1("SensorUtilsService", SensorUtilsService);
        }
    }
});
//# sourceMappingURL=utils.service.js.map