import {Inject, Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers, RequestOptions} from 'angular2/http';
import {ProbeListData} from './model';

@Injectable()
export class ProbeService {
    probesList$: Observable<ProbeListData[]>;
    private _listDataStore: {
        probeData: ProbeListData[]
    };
    
    constructor(private http: Http) {
        this._listDataStore = { probeData: [] };
    }

    getProbes = () => {
        this.probesList$ = this.http.get("api/probeslist")
            .map(response => response.json());
        // .subscribe(
        // data => this.probes$ = data,
        // err => this.logError(err)
        // // () => console.log('subscribe ')
        // );
    };

    updateProbe = (_probe) => {
        var probe;
        var body = JSON.stringify(_probe);
        var headers = new Headers({ 'Content-Type': 'application/json' });
        var options = new RequestOptions({ headers: headers });

        this.http.put('api/probe/' + _probe.pid, body, options)
            .map(response => response.json())
            .subscribe(
            data => probe = data,
            err => this.logError(err));
        // () => console.log('subscribe ')

    };

    logError(err) {
        console.error('There was an error: ' + err);
    }
}