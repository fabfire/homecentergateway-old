import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES } from 'angular2/router';

@Component({
    selector: 'main-content',
    templateUrl: './app/layout/main-content.component.html',
    directives : [ROUTER_DIRECTIVES]
})

export class MainContentComponent { }