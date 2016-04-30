System.register(['angular2/core', 'ng2-highcharts', './probe.service', './utils.service'], function(exports_1, context_1) {
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
    var core_1, ng2_highcharts_1, probe_service_1, utils_service_1;
    var $this, SensorChartComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (ng2_highcharts_1_1) {
                ng2_highcharts_1 = ng2_highcharts_1_1;
            },
            function (probe_service_1_1) {
                probe_service_1 = probe_service_1_1;
            },
            function (utils_service_1_1) {
                utils_service_1 = utils_service_1_1;
            }],
        execute: function() {
            SensorChartComponent = (function () {
                function SensorChartComponent(_probeService, _utilsService) {
                    this._probeService = _probeService;
                    this._utilsService = _utilsService;
                    this.chartStock = {};
                }
                SensorChartComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    $this = this;
                    var lastDate = new Date(this.lastValueDate);
                    var start, end = new Date();
                    var now = moment();
                    var selectedRange = 1;
                    if (lastDate > now.subtract(1, 'h')) {
                        console.log('up to date', this.sensorType);
                        start = moment().subtract(1, 'w');
                    }
                    else {
                        console.log('not up to date', this.sensorType);
                        selectedRange = 5;
                    }
                    var options = Highcharts.setOptions({
                        lang: {
                            loading: 'Chargement...',
                            months: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
                            weekdays: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
                            shortMonths: ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'aoû', 'sep', 'oct', 'nov', 'déc'],
                            printChart: 'Imprimer',
                            // rangeSelectorZoom: 'Période',
                            // rangeSelectorFrom: 'Du',
                            // rangeSelectorTo: 'au',
                            downloadPNG: 'Télécharger en PNG',
                            downloadJPEG: 'Télécharger en JPEG',
                            downloadPDF: 'Télécharger en PDF',
                            downloadSVG: 'Télécharger en SVG',
                            resetZoom: "Réinitialiser le zoom",
                            resetZoomTitle: "Réinitialiser le zoom",
                            thousandsSep: ' ',
                            decimalPoint: ','
                        },
                        global: {
                            useUTC: false
                        }
                    });
                    this._probeService.getChartData(this.sensorId, (start === undefined ? '' : start.toISOString()), end.toISOString()).subscribe(function (data) {
                        _this.chartStock = {
                            rangeSelector: {
                                buttons: [
                                    {
                                        type: 'day',
                                        count: 1,
                                        text: 'jour'
                                    }, {
                                        type: 'week',
                                        count: 1,
                                        text: 'sem'
                                    }, {
                                        type: 'month',
                                        count: 1,
                                        text: 'mois'
                                    }, {
                                        type: 'month',
                                        count: 3,
                                        text: 'tri'
                                    }, {
                                        type: 'year',
                                        count: 1,
                                        text: 'an'
                                    }, {
                                        type: 'all',
                                        text: 'tout'
                                    }],
                                selected: selectedRange,
                            },
                            xAxis: {
                                events: {
                                    afterSetExtremes: _this.afterSetExtremes
                                },
                                minRange: 3600 * 1000 // one hour
                            },
                            yAxis: {
                                title: {
                                    text: _this._utilsService.getTypeAxisLabel(_this.sensorType)
                                }
                            },
                            navigator: {
                                adaptToUpdatedData: false,
                                series: {
                                    data: data
                                }
                            },
                            scrollbar: {
                                liveRedraw: false
                            },
                            series: [{
                                    name: 'Valeur',
                                    data: data,
                                    tooltip: {
                                        valueDecimals: 1
                                    },
                                    dataGrouping: {
                                        enabled: true
                                    }
                                }]
                        };
                        // apply the date pickers
                        setTimeout(function () {
                            $('input.highcharts-range-selector').datepicker({
                                format: "yyyy-mm-dd",
                                autoclose: true,
                                language: "fr",
                                todayHighlight: true
                            });
                        }, 50);
                    }, function (err) {
                        console.error('Error loading sensor data', _this.sensorId, err);
                    });
                };
                SensorChartComponent.prototype.afterSetExtremes = function (e) {
                    var chart = $($('.graph')).highcharts();
                    chart.showLoading('Chargement des données...');
                    $this._probeService.getChartData($this.sensorId, new Date(Math.round(e.min)).toISOString(), new Date(Math.round(e.max)).toISOString()).subscribe(function (data) {
                        chart.series[0].setData(data);
                        chart.hideLoading();
                    });
                };
                SensorChartComponent.prototype.routerCanReuse = function (next, prev) { return true; };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], SensorChartComponent.prototype, "sensorId", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], SensorChartComponent.prototype, "sensorType", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], SensorChartComponent.prototype, "lastValueDate", void 0);
                SensorChartComponent = __decorate([
                    core_1.Component({
                        selector: 'sensor-chart',
                        templateUrl: './app/sensor/sensor-chart-component.html',
                        directives: [ng2_highcharts_1.Ng2Highstocks]
                    }), 
                    __metadata('design:paramtypes', [probe_service_1.ProbeService, utils_service_1.SensorUtilsService])
                ], SensorChartComponent);
                return SensorChartComponent;
            }());
            exports_1("SensorChartComponent", SensorChartComponent);
        }
    }
});
//# sourceMappingURL=sensor-chart-component.js.map