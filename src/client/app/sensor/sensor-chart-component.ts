import {Input, Component, OnInit} from 'angular2/core';
import {CanReuse, ComponentInstruction, ROUTER_DIRECTIVES} from 'angular2/router';
import {Observable, Subscription} from 'rxjs/Rx';
import {ProbeService} from './probe.service'
import {ProbeData, ProbeDetailData, HashTable} from './model';
import {SensorUtilsService} from './utils.service'

declare var moment: any;

@Component({
    selector: 'sensor-chart',
    templateUrl: './app/sensor/sensor-chart-component.html'
})
export class SensorChartComponent implements OnInit, CanReuse {
    @Input() sensorid: string;
    @Input() lastValueDate: string;

    constructor(private _probeService: ProbeService, private _utilsService: SensorUtilsService) { }

    ngOnInit() {
        var lastDate = new Date(this.lastValueDate);
        var now = moment();
        if (lastDate > now.subtract(1, 'h')) {
                console.log('up to date');
        }
        else{
             console.log('not up to date');
        }
        
    }

    routerCanReuse(next: ComponentInstruction, prev: ComponentInstruction) { return true; }
}