import {Input, Component, OnInit} from 'angular2/core';
import {CanReuse, ComponentInstruction, ROUTER_DIRECTIVES} from 'angular2/router';
import {Observable, Subscription} from 'rxjs/Rx';
import {Ng2Highstocks} from 'ng2-highcharts';
import {SensorService} from './sensor.service'
import {ProbeData, ProbeDetailData, PointEditData} from './model';
import {SensorUtilsService} from './utils.service'

declare var moment: any;
declare var $: any;
var $this;

@Component({
    selector: 'sensor-chart',
    templateUrl: './app/sensor/sensor-chart-component.html',
    directives: [Ng2Highstocks]
})
export class SensorChartComponent implements OnInit, CanReuse {
    @Input() sensorId: string;
    @Input() sensorType: string;
    @Input() minDate: Date;
    @Input() lastValueDate: Date;
    chartStock = {};
	pointEditData: PointEditData = new PointEditData();

    constructor(private _sensorService: SensorService, private _utilsService: SensorUtilsService) { }

    ngOnInit() {
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

		this._sensorService.getChartData(this.sensorId, (start === undefined ? '' : start.toISOString()), (end === undefined ? '' : end.toISOString())).subscribe(
			data => {
				this.chartStock = {
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
							text: this._utilsService.getTypeAxisLabel(this.sensorType)
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
									click: this.pointClick
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

					} (Highcharts));
				}, 1000);

			},
			err => {
				console.error('Error loading sensor data', this.sensorId, err);
			});

		$('.sidebar-toggle').click(function () {
			console.log('resize');
			setTimeout(function () {
				$('#graph').highcharts().reflow();
			}, 500);
		});
    }

	afterSetExtremes(e) {
		var chart = $('#graph').highcharts();
		chart.showLoading('Chargement des données...');
		$this._sensorService.getChartData($this.sensorId, new Date(Math.round(e.min)).toISOString(), new Date(Math.round(e.max + 43200000)).toISOString()).subscribe(
			data => {
				chart.series[0].setData(data);
				chart.hideLoading();
			});
	}

	pointClick(e) {
		var date = new moment(e.point.category);
		var value = e.point.y;

		$this.pointEditData.category = e.point.category;
		$this.pointEditData.date = date.format("dddd DD MMMM YYYY, HH:mm:ss");
		$this.pointEditData.value = value;
		$this.pointEditData.id = undefined;
		$this.pointEditData.index = e.point.index;
		$this._sensorService.getSensorMeasureId($this.sensorId, date, value).subscribe(data => {
			if (data.hasOwnProperty('_id')) {
				$this.pointEditData.id = data._id;
			}
		});
		$('#chart-edit-modal').modal('show');
	}

	changeValue() {
		$('#chart-edit-modal').modal('hide');
		var val = parseFloat($this.pointEditData.value);
		$this._sensorService.updateMeasure($this.pointEditData.id, val).subscribe(
			data => {
				if (data.successful === 1) {
					setTimeout(function () {
						$('#graph').highcharts().series[0].data[$this.pointEditData.index].update({ y: val });
					}, 200);
				}
			});
	}

	deleteValue() {
		$('#chart-edit-modal').modal('hide');
		$this._sensorService.deleteMeasure($this.pointEditData.id).subscribe(
			data => {
				if (data.found === true) {
					setTimeout(function () {
						$('#graph').highcharts().series[0].data[$this.pointEditData.index].remove();
					}, 200);
				}
			});
	}

	routerCanReuse(next: ComponentInstruction, prev: ComponentInstruction) { return true; }
}