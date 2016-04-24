import {Component, OnInit} from 'angular2/core';
import {Router, RouteParams, CanReuse, ComponentInstruction} from 'angular2/router';
import {Observable, Subscription} from 'rxjs/Rx';
import {SensorService} from './sensor.service'
import {SensorData, HashTable} from './model';

declare var $: any;

@Component({
    selector: 'sensor-detail',
    templateUrl: './app/sensor/sensor-detail.component.html'
})
export class SensorDetailComponent implements OnInit, CanReuse {

    sensorData: SensorData;
    editSensorData: SensorData;
    subscription: Subscription;

    constructor(private _router: Router, private _routeParams: RouteParams, private _sensorService: SensorService) { }

    ngOnInit() {
        let id = this._routeParams.get('id');
        let type = this._routeParams.get('type');

        // automatically update sensor view when new data comes
        this.subscription = this._sensorService.sensorUpdated$.subscribe(
            _id => {
                 if (id === _id) {
                    this.getSensor(id, type);
                }
            });

        this.getSensor(id, type);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    routerCanReuse(next: ComponentInstruction, prev: ComponentInstruction) { return true; }

    save() {
        this._sensorService.updateSensor(this.editSensorData);
        this._router.navigate(['/Sensors']);
        return false; //to prevent Chrome to submit the form (refresh page)
    }

    cancel() {
        this.editSensorData = this.clone(this.sensorData);
    }

    private getSensor(id, type) {
        this.sensorData = this._sensorService.getSensor(id, type);
        this.editSensorData = this.clone(this.sensorData);
    }

    private clone(obj) {
        return Object.assign({}, obj);
    }
}