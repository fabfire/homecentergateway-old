import {Component, OnInit} from 'angular2/core';
import {CanReuse, ComponentInstruction, ROUTER_DIRECTIVES} from 'angular2/router';
import {Observable, Subscription} from 'rxjs/Rx';
import {SensorService} from './sensor.service'
import {SensorData, HashTable} from './sensor.model';

@Component({
    selector: 'probe-list',
    templateUrl: './app/sensor/probe-list.component.html',
    directives: [ROUTER_DIRECTIVES],
})
export class ProbeListComponent implements OnInit, CanReuse {

    constructor() { }

    ngOnInit() {
    }

    routerCanReuse(next: ComponentInstruction, prev: ComponentInstruction) { return true; }
}