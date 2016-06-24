import {bootstrap} from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core'
//import {ROUTER_PROVIDERS } from '@angular/router';
import { APP_ROUTER_PROVIDERS } from './app.routes';
import {AppComponent} from './app.component';

//enableProdMode();
bootstrap(AppComponent, [
  APP_ROUTER_PROVIDERS
]);