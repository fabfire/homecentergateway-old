import {Component} from 'angular2/core';
import { MainHeaderComponent } from './layout/main-header.component';
import { MainSidebarComponent } from './layout/main-sidebar.component';

@Component({
    selector: 'homecenter',
    templateUrl: './app/app.component.html',
    directives : [MainHeaderComponent, MainSidebarComponent]
})
export class AppComponent { }