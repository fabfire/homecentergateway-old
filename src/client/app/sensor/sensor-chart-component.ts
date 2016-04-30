import {Input, Component, OnInit} from 'angular2/core';
import {CanReuse, ComponentInstruction, ROUTER_DIRECTIVES} from 'angular2/router';
import {Observable, Subscription} from 'rxjs/Rx';
import {Ng2Highstocks} from 'ng2-highcharts';
import {ProbeService} from './probe.service'
import {ProbeData, ProbeDetailData, HashTable} from './model';
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
    @Input() lastValueDate: string;
    chartStock = {};

    constructor(private _probeService: ProbeService, private _utilsService: SensorUtilsService) { }

    ngOnInit() {
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

		this._probeService.getChartData(this.sensorId, (start === undefined ? '' : start.toISOString()), end.toISOString()).subscribe(
			data => {
				this.chartStock = {
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
						// inputDateFormat: '%Y-%m-%d',
						// inputEditDateFormat: '%Y-%m-%d'
					},
					xAxis: {
						events: {
							afterSetExtremes: this.afterSetExtremes
						},
						minRange: 3600 * 1000 // one hour
					},
					yAxis: {
						title: {
							text: this._utilsService.getTypeAxisLabel(this.sensorType)
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
			},
			err => {
				console.error('Error loading sensor data', this.sensorId, err);
			});
    }

	afterSetExtremes(e) {
		var chart = $($('.graph')).highcharts();
		chart.showLoading('Chargement des données...');
		$this._probeService.getChartData($this.sensorId, new Date(Math.round(e.min)).toISOString(), new Date(Math.round(e.max)).toISOString()).subscribe(
			data => {
				chart.series[0].setData(data);
				chart.hideLoading();
			});
	}

	routerCanReuse(next: ComponentInstruction, prev: ComponentInstruction) { return true; }
}