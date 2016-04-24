import {Component, OnInit} from 'angular2/core';
import {CanReuse, ComponentInstruction, ROUTER_DIRECTIVES} from 'angular2/router';
import {Observable, Subscription} from 'rxjs/Rx';
import {ProbeService} from './probe.service'
import {ProbeListData, HashTable} from './model';

@Component({
    selector: 'probe-detail',
    templateUrl: './app/sensor/probe-detail.component.html',
    directives: [ROUTER_DIRECTIVES],
})
export class ProbeDetailComponent implements OnInit, CanReuse {
    
    constructor(private _probeService: ProbeService) { }

    ngOnInit() {
       
    }

    routerCanReuse(next: ComponentInstruction, prev: ComponentInstruction) { return true; }
}