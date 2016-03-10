import {Component} from 'angular2/core';
import { AfterViewInit } from 'angular2/core';
import { MainHeaderComponent } from './layout/main-header.component';
import { MainSidebarComponent } from './layout/main-sidebar.component';
import { MainContentComponent } from './layout/main-content.component';
import { MainFooterComponent } from './layout/main-footer.component';
import { ControlSidebarComponent } from './layout/control-sidebar.component';
import { ROUTER_PROVIDERS, ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';
import { SensorListComponent } from './sensor/sensor-list.component';
import { ConsoleComponent } from './console/console.component';
import {SensorService} from './sensor/sensor.service'

declare var loadAdminLTE: any;

@Component({
    selector: 'homecenter',
    templateUrl: './app/app.component.html',
    directives: [MainHeaderComponent, MainSidebarComponent, MainContentComponent, MainFooterComponent, ControlSidebarComponent]
   ,providers: [ROUTER_PROVIDERS, SensorService]
})

@RouteConfig([
  { path: '/', name: 'Sensors', component: SensorListComponent , useAsDefault: true },
  { path: '/console', name: 'Console', component: ConsoleComponent }
  ])
export class AppComponent implements AfterViewInit {

    ngAfterViewInit() {
        //Initialize theme AdminLTE.
        loadAdminLTE();
    }
}