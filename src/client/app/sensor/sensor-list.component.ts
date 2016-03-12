import {Component, OnInit, AfterViewInit} from 'angular2/core';
import {CanReuse, OnReuse, ComponentInstruction} from 'angular2/router';
import {Observable} from 'rxjs/Rx';
import {SensorService} from './sensor.service'
import {SensorData, HashTable} from './sensor.model';

declare var $: any;

@Component({
    selector: 'sensor-list',
    templateUrl: './app/sensor/sensor-list.component.html'
})
export class SensorListComponent implements OnInit, CanReuse, AfterViewInit {
    sensorsData: Observable<SensorData[]>;

    constructor(private _sensorService: SensorService) { }

    ngOnInit() {

        // Two of doing subscription to observables :
        // 1 : explicitly subscribe
        // this._sensorService.sensorsData$.subscribe(
        //     updatedData => {
        //         this.sensorsData = updatedData;
        //     });
        // 2 : bind member and use async pipe into the view

        console.log('oninit');
        this._sensorService.sensorUpdated$.subscribe(nodeid => {
            setTimeout(function() {
                $(".small-box[data-nodeid=" + nodeid + "]").find(".icon").addClass("zoom").delay(800).queue(function() {
                    $(this).removeClass("zoom").dequeue();
                });
            }, 200);
        });
        this.sensorsData = this._sensorService.sensorsData$;

        this._sensorService.getSensorInfo();
    }

    routerCanReuse(next: ComponentInstruction, prev: ComponentInstruction) { return true; }
    ngAfterViewInit() {
        console.log('ngAfterViewInit');
        //this._sensorService.getSensorInfo();
    }
}