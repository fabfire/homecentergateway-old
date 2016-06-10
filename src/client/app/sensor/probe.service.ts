import {Inject, Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {ProbeData} from './model';

@Injectable()
export class ProbeService {
    // Observable for update detection of the probe list info
    probesList$: Observable<ProbeData[]>;
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
        this._listDataStore = { probeData: [] };
    }

    getProbes = () => {
        // refresh observable during the load form the API
        if (this._listDataStore.probeData) {
            var $this = this;
            this._listDataStore.probeData.forEach((probe) => {
                $this._probeUpdated.next(probe.pid);
            });
        }

        this.probesList$ = this.http.get("api/probeslist")
            .map(this.extractProbeList);
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
            // for (var attr in probe) {
            //      var obj = $this._listDataStore.probeData[i];
            //     obj[attr] = probe[attr];
            // }
            //$this._listDataStore.probeData[i] = probe;
            $this._probeUpdated.next(probe.pid);
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