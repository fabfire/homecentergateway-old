import {Inject, Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';
import {Http, Headers, RequestOptions} from '@angular/http';
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
        this.probesList$ = this.http.get("api/probeslist")
            .map(response => response.json());
        this.probesList$.subscribe(_probe => {
            var $this = this;
            _probe.forEach((probe, i) => {
                $this._listDataStore.probeData[i] = probe;
                this._probeUpdated.next(probe.pid);
            })
        }, err => this.logError(err)
            //, () => console.log('subscribe ')
        );

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
            .map(response => response.json());
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