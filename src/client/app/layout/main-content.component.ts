import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES } from 'angular2/router';
import {SensorService} from '../sensor/sensor.service'

declare var io: any;
declare var kendoConsole: any;

@Component({
    selector: 'main-content',
    templateUrl: './app/layout/main-content.component.html',
    directives: [ROUTER_DIRECTIVES]
})

export class MainContentComponent implements OnInit {
    socket: any;
    
    constructor (private _sensorService : SensorService) {}
    
    ngOnInit() {
        //this.socket = io.connect('http://localhost:5000');
        this.socket = io.connect();
        this.socket.on("message", (msg) => {
            //this.messages.push(msg);
            this._sensorService.messageReceived(msg);
            console.log(msg);
            kendoConsole.log(JSON.stringify(msg));
        });

    }
}