import {Injectable} from 'angular2/core';
import {Observable, Observer, Subject} from 'rxjs/Rx';
import {SensorData, HashTable} from './sensor.model';

@Injectable()
export class SensorService {
    messages: Array<String> = [];
    // observables for list of sensors
    sensorsData$: Observable<SensorData[]>;
    private _sensorDataObserver: Observer<SensorData[]>;

    // Observable string ressource for showing update of one sensor
    private _sensorUpdated = new Subject<string>();
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
            this.updateSensor(msg);
        }
    };

    updateSensor = (data) => {
        data.date = new Date(data.date);
        var updated = false;
        // update sensor data if it exists
        this._dataStore.sensorData.forEach((sensor, i) => {
            if (sensor.id === data.id && sensor.type === data.type) {
                this._dataStore.sensorData[i] = data;
                updated = true;
            }
        });
        // or create it the 1st time
        if (!updated) {
            this._dataStore.sensorData.push(data);
        }
        if (this._sensorDataObserver != undefined) {
            this._sensorDataObserver.next(this._dataStore.sensorData);
        }
        this.sensorUpdated(data.id);
    }

    sensorUpdated = (id: string) => {
        this._sensorUpdated.next(id);
    }

    loadSensorInfo = () => {
        this._sensorDataObserver.next(this._dataStore.sensorData);
    }

    getSensor(id, type): SensorData {
        var foundSensor: SensorData;
        this._dataStore.sensorData.some((sensor, i) => {
            if (sensor.id === id && sensor.type === type) {
                foundSensor = sensor;
                return true;
            }
        });

        return foundSensor;
    }

    getMessage = () => {
        return this.messages;
    };
}

