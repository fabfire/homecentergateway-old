import {Component, OnInit} from 'angular2/core';
import {CanReuse, ComponentInstruction, ROUTER_DIRECTIVES} from 'angular2/router';
import {Observable, Subscription} from 'rxjs/Rx';
import {ProbeService} from './probe.service'
import {ProbeData, HashTable} from './sensor.model';

@Component({
    selector: 'probe-list',
    templateUrl: './app/sensor/probe-list.component.html',
    directives: [ROUTER_DIRECTIVES],
})
export class ProbeListComponent implements OnInit, CanReuse {
    probes: ProbeData[];

    constructor(private _probeService: ProbeService) { }

    ngOnInit() {
        this._probeService.probes$
            .subscribe(_probes => this.probes = _probes,
            console.error);
            //() => console.log('Completed!'));
                    
        //this._probeService.getProbes();
    }

    routerCanReuse(next: ComponentInstruction, prev: ComponentInstruction) { return true; }
}