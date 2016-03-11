import {Injectable} from 'angular2/core';
import {Observable, Observer} from 'rxjs/Rx';
import {SensorData, HashTable} from './sensor.model';



@Injectable()
export class SensorService {
    messages: Array<String> = [];
    sensorsData$: Observable<SensorData[]>;
    private _sensorDataObserver: Observer<SensorData[]>;
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
        this.addSensorInfo(msg);
    };

    addSensorInfo = (data) => {
        //var dateStr = JSON.parse(data.date);
        data.date = new Date(data.date);
        var updated = false;
        // update sensor data if it exists
        this._dataStore.sensorData.forEach((sensor, i) => {
            if (sensor.nodeid === data.nodeid) {
                this._dataStore.sensorData[i] = data;
                updated = true;
            }
        });
        // or create it the 1st time
        if (!updated) {
            this._dataStore.sensorData.push(data);
        }
        this._sensorDataObserver.next(this._dataStore.sensorData);
    }

    getMessage = () => {
        return this.messages;
    };
}

