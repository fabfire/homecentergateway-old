import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, ROUTER_DIRECTIVES} from '@angular/router';
import {Observable, Subscription} from 'rxjs/Rx';
import {ProbeService} from './probe.service'
import {ProbeData, ProbeDetailData, HashTable} from './model';
import {SensorUtilsService} from './utils.service'

@Component({
    selector: 'probe-detail',
    templateUrl: './app/sensor/probe-detail.component.html',
    directives: [ROUTER_DIRECTIVES],
})
export class ProbeDetailComponent implements OnInit {
    probeData: ProbeData;
    editProbeData: ProbeData;
    probeDetailedData: ProbeDetailData;
    subscription: Subscription;
    id: string;
    private sub: any;

    // subscriptionDetail: Subscription;

    constructor(private _router: Router, private _route: ActivatedRoute, private _probeService: ProbeService, private _utilsService: SensorUtilsService) { }

    // routerOnActivate(curr: RouteSegment) {
    //     this.id = curr.getParam('id');
    // }

    ngOnInit() {

        this.sub = this._route.params.subscribe(params => {
            this.id = params['id']; // (+) converts string 'id' to a number
            console.log('param ', this.id);
        });
        // automatically update sensor view when new data comes
        this.subscription = this._probeService.probeUpdated$.subscribe(
            _id => {
                if (this.id === _id) {
                    this.getProbe(_id);
                }
            });

        this.getProbe(this.id);

        this._probeService.getProbeDetail(this.id).subscribe(
            updatedData => { this.probeDetailedData = updatedData; });
    }

    private getProbe(id) {
        this.probeData = this._probeService.getProbe(id);
        if (!this.probeData) {
            this._probeService.getProbes();
            this._probeService.probesList$
                .subscribe(_probes => {
                    this.probeData = this._probeService.getProbe(id);
                }, console.error);
        }
        this.editProbeData = this.clone(this.probeData);
    }

    private clone(obj) {
        return Object.assign({}, obj);
    }
}