import { Component } from 'angular2/core';
import { AfterViewInit } from 'angular2/core';
import { MainHeaderComponent } from './layout/main-header.component';
import { MainSidebarComponent } from './layout/main-sidebar.component';
import { MainContentComponent } from './layout/main-content.component';
import { MainFooterComponent } from './layout/main-footer.component';
import { ControlSidebarComponent } from './layout/control-sidebar.component';
import { ROUTER_PROVIDERS, ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';
import { HTTP_PROVIDERS} from 'angular2/http';
import { ProbeListComponent } from './sensor/probe-list.component';
import { ProbeDetailComponent } from './sensor/probe-detail.component';
import { SensorListComponent } from './sensor/sensor-list.component';
import { SensorDetailComponent } from './sensor/sensor-detail.component';
import { ConsoleComponent } from './console/console.component';
import { SensorService } from './sensor/sensor.service'
import { ProbeService } from './sensor/probe.service'

declare var loadAdminLTE: any;

@Component({
    selector: 'homecenter',
    templateUrl: './app/app.component.html',
    directives: [MainHeaderComponent, MainSidebarComponent, MainContentComponent, MainFooterComponent, ControlSidebarComponent]
    , providers: [ROUTER_PROVIDERS, HTTP_PROVIDERS, SensorService, ProbeService]
})

@RouteConfig([
    { path: '/', name: 'Sensors', component: SensorListComponent, useAsDefault: true },
    { path: '/sensor/:type/:id', name: 'SensorDetail', component: SensorDetailComponent },
    { path: '/probes', name: 'Probes', component: ProbeListComponent },
    { path: '/probe/:id', name: 'ProbeDetail', component: ProbeDetailComponent },
    { path: '/console', name: 'Console', component: ConsoleComponent }
])
export class AppComponent implements AfterViewInit {
    constructor(private _sensorService: SensorService) { }

    ngAfterViewInit() {
        //Initialize theme AdminLTE.
        loadAdminLTE();
    }
}