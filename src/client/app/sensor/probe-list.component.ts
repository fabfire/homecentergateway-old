import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs/Rx';
import {ProbeService} from './probe.service'
import {ProbeData, HashTable} from './model';
import {FilterPipe} from '../pipes/filter-sensor-pipe'
import {OrderBy} from '../orderby';

declare var $: any;

@Component({
    selector: 'probe-list',
    templateUrl: './app/sensor/probe-list.component.html',
    directives: [ROUTER_DIRECTIVES],
    pipes: [OrderBy, FilterPipe]
})
export class ProbeListComponent implements OnInit {
    probes: ProbeData[];

    constructor(private router: Router, private _probeService: ProbeService) { }

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

    //  routerCanReuse(next: ComponentInstruction, prev: ComponentInstruction) { return true; }
}

