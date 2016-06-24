import { provideRouter, RouterConfig } from '@angular/router';
import { ProbeListComponent } from './sensor/probe-list.component';
import { ProbeDetailComponent } from './sensor/probe-detail.component';
import { SensorListComponent } from './sensor/sensor-list.component';
import { SensorDetailComponent } from './sensor/sensor-detail.component';
import { ConsoleComponent } from './console/console.component';

export const routes: RouterConfig = [
    { path: '', component: SensorListComponent },
    { path: 'sensor/:type/:id', component: SensorDetailComponent },
    { path: 'probes', component: ProbeListComponent },
    { path: 'probe/:id', component: ProbeDetailComponent },
    { path: 'console', component: ConsoleComponent }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];