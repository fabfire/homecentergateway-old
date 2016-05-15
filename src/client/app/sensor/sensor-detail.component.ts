import {Component, OnInit} from '@angular/core';
import {Router, RouteSegment} from '@angular/router';
import {Observable, Subscription} from 'rxjs/Rx';
import {SensorService} from './sensor.service'
import {SensorChartComponent} from './sensor-chart-component'
import {SensorData, HashTable} from './model';
import {SensorUtilsService} from './utils.service'

declare var $: any;

@Component({
    selector: 'sensor-detail',
    templateUrl: './app/sensor/sensor-detail.component.html',
    directives: [SensorChartComponent]
})
export class SensorDetailComponent implements OnInit {
    sensorid: string;
    sensortype: string;
    minDate: Date;
    lastDate: Date;
    sensorData: SensorData;
    editSensorData: SensorData;
    subscription: Subscription;
    id: string;
    type: string;
    
    constructor(private _router: Router, private _sensorService: SensorService, private _utilsService: SensorUtilsService) { }
    
    routerOnActivate(curr: RouteSegment) {
        this.id = curr.getParam('id');
       this.type = curr.getParam('type');
    }
    
    ngOnInit() {
        this.sensorid = this.id;
        this.sensortype = this.type;

        // automatically update sensor view when new data comes
        this.subscription = this._sensorService.sensorUpdated$.subscribe(
            _id => {
                if (this.id === _id) {
                    this.getSensor(this.id, this.type);
                }
            });

        this.getSensor(this.id, this.type);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    
    save() {
        this._sensorService.updateSensor(this.editSensorData);
        this._router.navigate(['/']);
        return false; //to prevent Chrome to submit the form (refresh page)
    }

    cancel() {
        this.editSensorData = this.clone(this.sensorData);
    }

    private getSensor(id, type) {
        this.sensorData = this._sensorService.getSensor(id, type);
        this.editSensorData = this.clone(this.sensorData);
        if (this.editSensorData && this.editSensorData.date) {
            this.lastDate = this.editSensorData.date;
        } 
    }

    private clone(obj) {
        return Object.assign({}, obj);
    }
}