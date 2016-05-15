import {Component, OnInit} from '@angular/core';
import {CanReuse, ComponentInstruction, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {Observable, Subscription} from 'rxjs/Rx';
import {SensorService} from './sensor.service'
import {SensorData, HashTable} from './model';
import {OrderBy} from '../orderby';

declare var $: any;
declare var moment: any;

@Component({
    selector: 'sensor-list',
    templateUrl: './app/sensor/sensor-list.component.html',
    directives: [ROUTER_DIRECTIVES],
    pipes: [OrderBy]
})
export class SensorListComponent implements OnInit, CanReuse {
    // if use the async pipe, we have to declare an observable
    //sensorsData: Observable<SensorData[]>;
    sensorsData: SensorData[];
    listSubscription: Subscription;
    animationSubscription: Subscription;
    limitDate: Date;

    constructor(private _sensorService: SensorService) { }

    ngOnInit() {

        // Two ways of doing subscription to observables :
        // 1 : explicitly subscribe
        this.listSubscription = this._sensorService.sensorsData$.subscribe(
            updatedData => {
                this.sensorsData = updatedData;
                this.limitDate = moment().subtract(1, 'hour');
            }
        );
        // 2 : bind member and use async pipe into the view, but it doesn't work as expected : the view is not refreshed when the view is reloaded
        //this.sensorsData$ = this._sensorService.sensorsData$;

        // add a small animation when a particular sensor is update
        this.animationSubscription = this._sensorService.sensorUpdated$.subscribe(id => {
            setTimeout(function () {
                $(".small-box[data-id='" + id + "']").find(".icon").addClass("zoom").delay(1000).queue(function () {
                    $(this).removeClass("zoom").dequeue();
                });
            }, 200);
        });

        //this._sensorService.loadSensorInfo();
        this._sensorService.getSensors();
    }

    ngOnDestroy() {
        this.listSubscription.unsubscribe();
        this.animationSubscription.unsubscribe();
    }
    routerCanReuse(next: ComponentInstruction, prev: ComponentInstruction) { return true; }

}