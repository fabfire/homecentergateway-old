import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ROUTER_PROVIDERS, ROUTER_DIRECTIVES, Routes} from '@angular/router';
import { HTTP_PROVIDERS} from '@angular/http';

import { MainHeaderComponent } from './layout/main-header.component';
import { MainSidebarComponent } from './layout/main-sidebar.component';
import { MainContentComponent } from './layout/main-content.component';
import { MainFooterComponent } from './layout/main-footer.component';
import { ControlSidebarComponent } from './layout/control-sidebar.component';
import { ProbeListComponent } from './sensor/probe-list.component';
import { ProbeDetailComponent } from './sensor/probe-detail.component';
import { SensorListComponent } from './sensor/sensor-list.component';
import { SensorDetailComponent } from './sensor/sensor-detail.component';
import { ConsoleComponent } from './console/console.component';
import { SensorService } from './sensor/sensor.service'
import { ProbeService } from './sensor/probe.service'
import { SensorUtilsService } from './sensor/utils.service'
import { UserService } from './user/user.service'

declare var moment: any;
declare var toastr: any;
declare var loadAdminLTE: any;

@Component({
    selector: 'homecenter',
    templateUrl: './app/app.component.html',
    directives: [MainHeaderComponent, MainSidebarComponent, MainContentComponent, MainFooterComponent, ControlSidebarComponent],
    providers: [ROUTER_PROVIDERS, HTTP_PROVIDERS, SensorService, ProbeService, SensorUtilsService, UserService]
})

@Routes([
    { path: '/', component: SensorListComponent },
    { path: '/sensor/:type/:id', component: SensorDetailComponent },
    { path: '/probes', component: ProbeListComponent },
    { path: '/probe/:id', component: ProbeDetailComponent },
    { path: '/console', component: ConsoleComponent }
])
export class AppComponent implements AfterViewInit, OnInit {
    constructor(private _sensorService: SensorService) { }

    ngAfterViewInit() {
        //Initialize theme AdminLTE.
        loadAdminLTE();
    }

    ngOnInit() {
        moment.locale('fr');
        toastr.options = {
            "positionClass": "toast-bottom-right"
        }
    }
}