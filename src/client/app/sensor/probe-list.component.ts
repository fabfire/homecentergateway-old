import {Component, OnInit} from 'angular2/core';
import {CanReuse, ComponentInstruction, ROUTER_DIRECTIVES} from 'angular2/router';
import {Observable, Subscription} from 'rxjs/Rx';
import {ProbeService} from './probe.service'
import {ProbeListData, HashTable} from './model';

declare var $: any;

@Component({
    selector: 'probe-list',
    templateUrl: './app/sensor/probe-list.component.html',
    directives: [ROUTER_DIRECTIVES],
})
export class ProbeListComponent implements OnInit, CanReuse {
    probes: ProbeListData[];

    constructor(private _probeService: ProbeService) { }

    ngOnInit() {
        this._probeService.getProbes();
        this._probeService.probesList$
            .subscribe(_probes => {
                this.probes = _probes;
                setTimeout(function () {
                    $('.box').hover(
                        function () {
                            $(this).find('.widget-user-header').stop().animate({
                                'background-position': '20%'
                            }, 800, 'linear');
                        },
                        function () {
                            $(this).find('.widget-user-header').stop().animate({
                                'background-position': '0%'
                            }, 800, 'linear');
                        }
                    )
                }, 200);
            },
            console.error);
    }

    routerCanReuse(next: ComponentInstruction, prev: ComponentInstruction) { return true; }
}

