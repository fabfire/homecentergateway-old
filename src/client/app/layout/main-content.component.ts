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
    private sensorService : SensorService;
    
    constructor (private _sensorService : SensorService) { 
        this.sensorService = this._sensorService;
    }
    
    ngOnInit() {
        this.socket = io.connect('http://localhost:5000');
        this.socket.on("message", (msg) => {
            //this.messages.push(msg);
            this.sensorService.addMessage(JSON.stringify(msg));
            console.log(msg);
            kendoConsole.log(JSON.stringify(msg));
        });
    }
}