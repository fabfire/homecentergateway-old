import {Inject, Injectable} from '@angular/core';
import {Observable, Observer, Subject} from 'rxjs/Rx';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {ProbeData, SensorData} from './model';

@Injectable()
export class ProbeService {
    // Observable for update detection of the probe list info
    probesList$: Observable<ProbeData[]>;
    private _probesListObserver: Observer<ProbeData[]>;
    // Observable for update detection of probe detail info
    probeDetail$: Observable<ProbeData>;

    // Observable string ressource for showing update of one probe
    private _probeUpdated = new Subject<string>();
    // Observable streams
    probeUpdated$ = this._probeUpdated.asObservable();

    private _listDataStore: {
        probeData: ProbeData[]
    };

    constructor(private http: Http) {
        this.probesList$ = new Observable<ProbeData[]>(observer => this._probesListObserver = observer).share();
        this._listDataStore = { probeData: [] };
    }

    getProbes = () => {
        // refresh observable during the load form the API
        if (this._probesListObserver != undefined) {
            this._probesListObserver.next(this._listDataStore.probeData);
        }
        // if (this._listDataStore.probeData) {

        //     // var $this = this;
        //     // this._listDataStore.probeData.forEach((probe) => {
        //     //     $this._probeUpdated.next(probe.pid);
        //     // });
        // }

        this.http.get("api/probeslist")
            .map(this.extractProbeList)
            .subscribe(probes => {
                this.updateProbes(probes);
            });
    };

    extractProbeList = (response: Response) => {
        var probes = response.json();
        this.updateProbes(probes);
        return probes;
    }

    updateProbes = (probes: ProbeData[]) => {
        var $this = this;
        probes.forEach((probe, i) => {
            if ($this._listDataStore.probeData[i]) {
                Object.assign($this._listDataStore.probeData[i], probe);
            }
            else {
                $this._listDataStore.probeData[i] = probe;
            }

            $this._probeUpdated.next(probe.pid);
        });
    };

    updateDataStoreCount = (sensor: SensorData) => {
        var $this = this;
        this._listDataStore.probeData.some((probe, i) => {
            if (probe.pid === sensor.pid) {
                $this._listDataStore.probeData[i].numberofmeasures += 1;
                $this._probeUpdated.next(probe.pid);
                if ($this._listDataStore.probeData[i].sensorstats){
                    $this._listDataStore.probeData[i].sensorstats.some((_sensor, j) => {
                        if (sensor.id === _sensor.sensordata.id) {
                            $this._listDataStore.probeData[i].sensorstats[j].count += 1;
                        }
                    });

                }
                return true;
            }
        });
    };

    getProbe = (id: string) => {
        var foundProbe: ProbeData;
        this._listDataStore.probeData.some((probe, i) => {
            if (probe.pid === id) {
                foundProbe = probe;
                return true;
            }
        });
        return foundProbe;
    }

    getProbeDetail = (id: string) => {
        return this.http.get("api/probesensorsstats/" + id)
            .map(this.extractProbeDetail);
    };

    extractProbeDetail = (response: Response) => {
        var probe = response.json();
        this.updateProbeDetail(probe);
        return probe;
    };

    updateProbeDetail = (_probe) => {
        var $this = this;
        this._listDataStore.probeData.some((probe, i) => {
            if (probe.pid === _probe.pid) {
                $this._listDataStore.probeData[i].sensorstats = _probe.sensorstats;
                return true;
            }
        });
    };

    updateProbe = (_probe) => {
        var probe;
        var body = JSON.stringify(_probe);
        var headers = new Headers({ 'Content-Type': 'application/json' });
        var options = new RequestOptions({ headers: headers });

        var $this = this;
        this.http.put('api/probe/' + _probe.pid, body, options)
            .map(response => response.json())
            .subscribe(
            data => {
                $this._listDataStore.probeData.some((probe, i) => {
                    if (probe.pid === _probe.pid) {
                        probe.location = data.location;
                        return true;
                    }
                });
            },
            err => this.logError(err));
        // () => console.log('subscribe ')

    };

    logError(err) {
        console.error('There was an error: ' + err);
    }
}