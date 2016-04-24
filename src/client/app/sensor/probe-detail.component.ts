import {Component, OnInit} from 'angular2/core';
import {Router, RouteParams, CanReuse, ComponentInstruction, ROUTER_DIRECTIVES} from 'angular2/router';
import {Observable, Subscription} from 'rxjs/Rx';
import {ProbeService} from './probe.service'
import {ProbeData, ProbeDetailData, HashTable} from './model';
import {SensorUtilsService} from './utils.service'

@Component({
    selector: 'probe-detail',
    templateUrl: './app/sensor/probe-detail.component.html',
    directives: [ROUTER_DIRECTIVES],
})
export class ProbeDetailComponent implements OnInit, CanReuse {
    probeData: ProbeData;
    editProbeData: ProbeData;
    probeDetailedData: ProbeDetailData;
    subscription: Subscription;
    subscriptionDetail: Subscription;
    
    constructor(private _router: Router, private _routeParams: RouteParams, private _probeService: ProbeService, private _utilsService: SensorUtilsService) { }

    ngOnInit() {
        console.log('detail ngOnInit');
        let id = this._routeParams.get('id');
        // automatically update sensor view when new data comes
        // this.subscription = this._probeService.probeUpdated$.subscribe(
        //     _id => {
        //         if (id === _id) {
        //             this.getProbe(id);
        //         }
        //     });

        this.getProbe(id);

        this._probeService.getProbeDetail(id).subscribe(
            updatedData => { console.log(updatedData); this.probeDetailedData = updatedData; });
    }

    routerCanReuse(next: ComponentInstruction, prev: ComponentInstruction) { return true; }

    private getProbe(id) {
        this.probeData = this._probeService.getProbe(id);
        this.editProbeData = this.clone(this.probeData);
    }

    private clone(obj) {
        return Object.assign({}, obj);
    }

    // public getTypeLabel(type: string) {
    //     var str = type;
    //     switch (type) {
    //         case "temp":
    //             str = "Température";
    //             break;
    //         case "hum":
    //             str = "Humidité";
    //             break;
    //        case "pres":
    //             str = "Pression";
    //             break;
    //        case "vcc":
    //             str = "VCC";
    //             break;
    //        default:
    //             str = type;
    //             break;
    //     };
    //     return str;
    // }
}