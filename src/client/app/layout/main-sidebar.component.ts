import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES } from 'angular2/router';

import { SensorListComponent } from '../sensor/sensor-list.component';
import { ConsoleComponent } from '../console/console.component';

@Component({
    selector: 'main-sidebar',
    templateUrl: './app/layout/main-sidebar.component.html',
    directives: [ROUTER_DIRECTIVES, SensorListComponent, ConsoleComponent]
})

export class MainSidebarComponent { }