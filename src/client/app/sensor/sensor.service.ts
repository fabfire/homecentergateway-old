import {Inject, Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
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

    // sensor filter
    private searchFilter: string;

    private _dataStore: {
        sensorData: SensorData[]
    };

    constructor(private probeService: ProbeService, private http: Http) {
        // Create Observable Stream to output our data
        this.sensorsData$ = new Observable<SensorData[]>(observer => this._sensorDataObserver = observer).share();
        this._dataStore = { sensorData: [] };
    }

    messageReceived = (msg) => {
        this.messages.push(JSON.stringify(msg));

        if (!msg.hasOwnProperty('msg')) {
            this.updateSensor(msg);
        }
    };

    getSensors = () => {
        if (this._sensorDataObserver != undefined) {
            this._sensorDataObserver.next(this._dataStore.sensorData);
        }
        this.http.get("api/sensors")
            .map(response => response.json())
            .subscribe(sensors => {
                sensors.forEach((sensor) => {
                    this.updateSensor(sensor);
                });
            });
    };


    updateSensor = (data) => {
        data.date = new Date(data.date);
        if (data.mindate) {
            data.mindate = new Date(data.mindate);
        }
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
                this._dataStore.sensorData[i].date = data.date;
                this._dataStore.sensorData[i].value = data.value;
                this._dataStore.sensorData[i].name = data.name;
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

    // loadSensorInfo = () => {
    //     this._sensorDataObserver.next(this._dataStore.sensorData);
    // }

    updateSensorsName = (probeId, name) => {
        this._dataStore.sensorData.forEach((sensor, i) => {
            if (sensor.id.startsWith(probeId + '.')) {
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

    getChartData = (id: string, start: string, end: string) => {
        return this.http.get("api/sensorchartdata/" + id + (start === '' ? '' : '/' + start + '/' + end))
            .map(response => response.json());
        // Test file
        // return this.http.get('a.json');
    };

    getSensorMeasureId = (id: string, date: Date, value: number) => {
        var body = {
            id: id,
            date: date,
            value: value
        }
        var headers = new Headers({ 'Content-Type': 'application/json' });
        var options = new RequestOptions({ headers: headers });

        return this.http.post("api/getsensormeasureid/", JSON.stringify(body), options)
            .map(response => response.json());
    }

    updateMeasure = (id: string, value: number) => {
        var body = {
            id: id,
            value: value
        }
        var headers = new Headers({ 'Content-Type': 'application/json' });
        var options = new RequestOptions({ headers: headers });

        return this.http.put("api/updatesensormeasure/", JSON.stringify(body), options)
            .map(response => response.json());
    }

    deleteMeasure = (id: string) => {
        return this.http.delete("api/deletesensormeasure/" + id)
            .map(response => response.json());
    }

    updateFilter = (filter: string) => {
        this.searchFilter = filter;
    }

    getFilter = () => {
        return this.searchFilter;
    }
}

