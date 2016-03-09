import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES } from 'angular2/router';

import { ProbeListComponent } from '../probe/probe-list.component';
import { ConsoleComponent } from '../console/console.component';

@Component({
    selector: 'main-sidebar',
    templateUrl: './app/layout/main-sidebar.component.html',
    directives: [ROUTER_DIRECTIVES, ProbeListComponent, ConsoleComponent]
})

export class MainSidebarComponent { }