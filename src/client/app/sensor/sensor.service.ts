import {Injectable} from 'angular2/core';
import {Observable, Observer, Subject} from 'rxjs/Rx';
import {SensorData, HashTable} from './sensor.model';



@Injectable()
export class SensorService {
    messages: Array<String> = [];
    // observables for list of sensors
    sensorsData$: Observable<SensorData[]>;
    private _sensorDataObserver: Observer<SensorData[]>;
    // Observable number ressource for showing update of one sensor
    private _sensorUpdated = new Subject<number>();
    // Observable streams
    sensorUpdated$ = this._sensorUpdated.asObservable();

    private _dataStore: {
        sensorData: SensorData[]
    };

    constructor() {
        // Create Observable Stream to output our data
        this.sensorsData$ = new Observable(observer => this._sensorDataObserver = observer).share();

        this._dataStore = { sensorData: [] };
    }

    messageReceived = (msg) => {
        this.messages.push(JSON.stringify(msg));

        if (!msg.hasOwnProperty('msg')) {
            this.addSensorInfo(msg);
        }
    };

    addSensorInfo = (data) => {
        //var dateStr = JSON.parse(data.date);
        data.date = new Date(data.date);
        var updated = false;
        // update sensor data if it exists
        this._dataStore.sensorData.forEach((sensor, i) => {
            if (sensor.nodeid === data.nodeid && sensor.type === data.type) {
                this._dataStore.sensorData[i] = data;
                updated = true;
            }
        });
        // or create it the 1st time
        if (!updated) {
            this._dataStore.sensorData.push(data);
        }
        this._sensorDataObserver.next(this._dataStore.sensorData);
        this.updateSensorInfo(data.nodeid);
    }

    updateSensorInfo = (nodeid: number) => {
        this._sensorUpdated.next(nodeid);
    }

    getSensorInfo = () => {
        console.log('datastore ' + this._dataStore.sensorData.length);
        if (this._dataStore.sensorData.length > 0) {
            this._dataStore.sensorData.forEach((sensor, i) => {
                this.updateSensorInfo(sensor.nodeid)
            });
        }
    }


    getMessage = () => {
        return this.messages;
    };
}

