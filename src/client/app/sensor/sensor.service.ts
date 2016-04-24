import {Inject, Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Observable, Observer, Subject} from 'rxjs/Rx';
import {SensorData, HashTable} from './model';
import {ProbeService} from './probe.service';

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
    // ProbeService instance
    private probeService: ProbeService;

    private _dataStore: {
        sensorData: SensorData[]
    };

    constructor(probeService: ProbeService, http: Http) {
        // Create Observable Stream to output our data
        this.sensorsData$ = new Observable<SensorData[]>(observer => this._sensorDataObserver = observer).share();
        this._dataStore = { sensorData: [] };
        this.probeService = probeService;
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
            if (!updated && sensor.id === data.id && sensor.type === data.type) {
                // Location changed, call the BO
                if (this._dataStore.sensorData[i].name !== data.name) {
                    // call probe.service to update probe location
                    var probe = {
                        pid: data.pid,
                        location: data.name
                    };
                    this.probeService.updateProbe(probe);
                    this.updateSensorsName(probe.pid, probe.location);
                }
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

    updateSensorsName = (probeId, name) => {
        this._dataStore.sensorData.forEach((sensor, i) => {
            if(sensor.id.startsWith(probeId + '.')) {
                sensor.name = name
            }
        });
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

