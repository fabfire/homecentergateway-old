System.register(['angular2/core', 'ng2-highcharts', './sensor.service', './model', './utils.service'], function(exports_1, context_1) {
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
    var core_1, ng2_highcharts_1, sensor_service_1, model_1, utils_service_1;
    var $this, SensorChartComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (ng2_highcharts_1_1) {
                ng2_highcharts_1 = ng2_highcharts_1_1;
            },
            function (sensor_service_1_1) {
                sensor_service_1 = sensor_service_1_1;
            },
            function (model_1_1) {
                model_1 = model_1_1;
            },
            function (utils_service_1_1) {
                utils_service_1 = utils_service_1_1;
            }],
        execute: function() {
            SensorChartComponent = (function () {
                function SensorChartComponent(_sensorService, _utilsService) {
                    this._sensorService = _sensorService;
                    this._utilsService = _utilsService;
                    this.chartStock = {};
                    this.pointEditData = new model_1.PointEditData();
                }
                SensorChartComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    $this = this;
                    var start = this.minDate;
                    var end = this.lastValueDate;
                    moment.locale('fr');
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
                    this._sensorService.getChartData(this.sensorId, (start === undefined ? '' : start.toISOString()), (end === undefined ? '' : end.toISOString())).subscribe(function (data) {
                        _this.chartStock = {
                            chart: {
                                zoomType: 'x',
                                panning: true,
                                panKey: 'shift'
                            },
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
                                selected: 5,
                                inputDateFormat: '%Y-%m-%d',
                                inputEditDateFormat: '%Y-%m-%d'
                            },
                            xAxis: {
                                type: 'datetime',
                                minRange: 3600 * 1000 // one hour
                            },
                            yAxis: {
                                title: {
                                    text: _this._utilsService.getTypeAxisLabel(_this.sensorType)
                                }
                            },
                            plotOptions: {
                                series: {
                                    cursor: 'pointer',
                                    states: {
                                        hover: {
                                            lineWidthPlus: 0
                                        }
                                    },
                                    point: {
                                        events: {
                                            click: _this.pointClick
                                        }
                                    }
                                }
                            },
                            navigator: {
                                adaptToUpdatedData: false
                            },
                            scrollbar: {
                                liveRedraw: false
                            },
                            series: [{
                                    name: 'Valeur',
                                    data: data,
                                    tooltip: {
                                        valueDecimals: 1,
                                        dateTimeLabelFormats: 'seconds'
                                    },
                                    dataGrouping: {
                                        enabled: false
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
                        // add afterSetExtremes after the first load to prevent multiple calls to the API.
                        setTimeout(function () {
                            (function (H) {
                                var chart = $('#graph').highcharts();
                                H.addEvent(chart.xAxis[0], 'afterSetExtremes', function (e) {
                                    $this.afterSetExtremes(e);
                                });
                            }(Highcharts));
                        }, 1000);
                    }, function (err) {
                        console.error('Error loading sensor data', _this.sensorId, err);
                    });
                    $('.sidebar-toggle').click(function () {
                        console.log('resize');
                        setTimeout(function () {
                            $('#graph').highcharts().reflow();
                        }, 500);
                    });
                };
                SensorChartComponent.prototype.afterSetExtremes = function (e) {
                    var chart = $('#graph').highcharts();
                    chart.showLoading('Chargement des données...');
                    $this._sensorService.getChartData($this.sensorId, new Date(Math.round(e.min)).toISOString(), new Date(Math.round(e.max + 43200000)).toISOString()).subscribe(function (data) {
                        chart.series[0].setData(data);
                        chart.hideLoading();
                    });
                };
                SensorChartComponent.prototype.pointClick = function (e) {
                    var date = new moment(e.point.category);
                    var value = e.point.y;
                    $this.pointEditData.category = e.point.category;
                    $this.pointEditData.date = date.format("dddd DD MMMM YYYY, HH:mm:ss");
                    $this.pointEditData.value = value;
                    $this.pointEditData.id = undefined;
                    $this.pointEditData.index = e.point.index;
                    $this._sensorService.getSensorMeasureId($this.sensorId, date, value).subscribe(function (data) {
                        if (data.hasOwnProperty('_id')) {
                            $this.pointEditData.id = data._id;
                        }
                    });
                    $('#chart-edit-modal').modal('show');
                };
                SensorChartComponent.prototype.changeValue = function () {
                    $('#chart-edit-modal').modal('hide');
                    var val = parseFloat($this.pointEditData.value);
                    $this._sensorService.updateMeasure($this.pointEditData.id, val).subscribe(function (data) {
                        if (data.successful === 1) {
                            $('#graph').highcharts().series[0].data[$this.pointEditData.index].update({ y: val });
                        }
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
                    __metadata('design:type', Date)
                ], SensorChartComponent.prototype, "minDate", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Date)
                ], SensorChartComponent.prototype, "lastValueDate", void 0);
                SensorChartComponent = __decorate([
                    core_1.Component({
                        selector: 'sensor-chart',
                        templateUrl: './app/sensor/sensor-chart-component.html',
                        directives: [ng2_highcharts_1.Ng2Highstocks]
                    }), 
                    __metadata('design:paramtypes', [sensor_service_1.SensorService, utils_service_1.SensorUtilsService])
                ], SensorChartComponent);
                return SensorChartComponent;
            }());
            exports_1("SensorChartComponent", SensorChartComponent);
        }
    }
});
//# sourceMappingURL=sensor-chart-component.js.map