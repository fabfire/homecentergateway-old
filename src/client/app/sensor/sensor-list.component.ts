import {Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef} from '@angular/core';
import {Router, ROUTER_DIRECTIVES} from '@angular/router';
import {Observable, Subscription} from 'rxjs/Rx';
import {SensorService} from './sensor.service'
import {SensorData, HashTable} from './model';
import {OrderBy} from '../orderby';
import {FilterPipe} from '../pipes/filter-sensor-pipe'

declare var $: any;
declare var moment: any;

@Component({
    selector: 'sensor-list',
    templateUrl: './app/sensor/sensor-list.component.html',
    directives: [ROUTER_DIRECTIVES],
    pipes: [OrderBy, FilterPipe]
})
export class SensorListComponent implements OnInit {
    // if use the async pipe, we have to declare an observable
    //sensorsData: Observable<SensorData[]>;
    sensorsData: SensorData[];
    listSubscription: Subscription;
    animationSubscription: Subscription;
    limitDate: Date;

    constructor(private router: Router, private _sensorService: SensorService,private cd: ChangeDetectorRef) { }

    ngOnInit() {

        // Two ways of doing subscription to observables :
        // 1 : explicitly subscribe
        this.listSubscription = this._sensorService.sensorsData$.subscribe(
            updatedData => {
                this.sensorsData = updatedData;
                this.limitDate = moment().subtract(1, 'hour');
               // this.cd.markForCheck(); // marks path
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

        this._sensorService.getSensors();
    }

    ngOnDestroy() {
        this.listSubscription.unsubscribe();
        this.animationSubscription.unsubscribe();
    }
}