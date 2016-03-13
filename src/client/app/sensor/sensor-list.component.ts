import {Component, OnInit} from 'angular2/core';
import {CanReuse, OnReuse, ComponentInstruction} from 'angular2/router';
import {Observable} from 'rxjs/Rx';
import {SensorService} from './sensor.service'
import {SensorData, HashTable} from './sensor.model';

declare var $: any;

@Component({
    selector: 'sensor-list',
    templateUrl: './app/sensor/sensor-list.component.html'
})
export class SensorListComponent implements OnInit, CanReuse {
//    sensorsData: Observable<SensorData[]>;
    sensorsData: SensorData[];

    constructor(private _sensorService: SensorService) {}

    ngOnInit() {

        // Two of doing subscription to observables :
        // 1 : explicitly subscribe
        this._sensorService.sensorsData$.subscribe(
            updatedData => {this.sensorsData = updatedData;});
        // 2 : bind member and use async pipe into the view, but it doesn't work as expected : the view is not refreshed when the view is reloaded
        //this.sensorsData$ = this._sensorService.sensorsData$;

        // add a small animation when a particular sensor is update
        this._sensorService.sensorUpdated$.subscribe(nodeid => {
            setTimeout(function() {
                $(".small-box[data-nodeid=" + nodeid + "]").find(".icon").addClass("zoom").delay(800).queue(function() {
                    $(this).removeClass("zoom").dequeue();
                });
            }, 200);
        });
 
        this._sensorService.loadSensorInfo();
    }

    routerCanReuse(next: ComponentInstruction, prev: ComponentInstruction) { return true; }

}