import {Component, OnInit} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {SensorService} from './sensor.service'
import {SensorData, HashTable} from './sensor.model';

@Component({
    selector: 'sensor-list',
    templateUrl: './app/sensor/sensor-list.component.html'
})
export class SensorListComponent implements OnInit {
    sensorsData: Observable<SensorData[]>;
   
    constructor(private _sensorService: SensorService) { }
    
    ngOnInit() {
        //this._sensorService.sensorsData$.subscribe(sensorsData => this.sensorsData = sensorsData);
        this.sensorsData = this._sensorService.sensorsData$;
    }
}