import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { SensorListComponent } from '../sensor/sensor-list.component';
import { ConsoleComponent } from '../console/console.component';

@Component({
    selector: 'main-sidebar',
    templateUrl: './app/layout/main-sidebar.component.html',
    directives: [ROUTER_DIRECTIVES, SensorListComponent, ConsoleComponent]
})

export class MainSidebarComponent { }