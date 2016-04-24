import {Component, OnInit} from 'angular2/core';
import {CanReuse, ComponentInstruction, ROUTER_DIRECTIVES} from 'angular2/router';
import {Observable, Subscription} from 'rxjs/Rx';
import {SensorService} from './sensor.service'
import {SensorData, HashTable} from './model';

declare var $: any;

@Component({
    selector: 'sensor-list',
    templateUrl: './app/sensor/sensor-list.component.html',
    directives: [ROUTER_DIRECTIVES],
})
export class SensorListComponent implements OnInit, CanReuse {
    // if use the async pipe, we have to declare an observable
    //sensorsData: Observable<SensorData[]>;
    sensorsData: SensorData[];
    listSubscription: Subscription;
    animationSubscription: Subscription;

    constructor(private _sensorService: SensorService) { }

    ngOnInit() {

        // Two ways of doing subscription to observables :
        // 1 : explicitly subscribe
        this.listSubscription = this._sensorService.sensorsData$.subscribe(
            updatedData => { this.sensorsData = updatedData;});
        // 2 : bind member and use async pipe into the view, but it doesn't work as expected : the view is not refreshed when the view is reloaded
        //this.sensorsData$ = this._sensorService.sensorsData$;

        // add a small animation when a particular sensor is update
        this.animationSubscription = this._sensorService.sensorUpdated$.subscribe(id => {
            setTimeout(function() {
                $(".small-box[data-id='" + id + "']").find(".icon").addClass("zoom").delay(1000).queue(function() {
                    $(this).removeClass("zoom").dequeue();
                });
            }, 200);
        });

        this._sensorService.loadSensorInfo();
    }

    ngOnDestroy() {
        this.listSubscription.unsubscribe();
        this.animationSubscription.unsubscribe();
    }
    routerCanReuse(next: ComponentInstruction, prev: ComponentInstruction) { return true; }

}