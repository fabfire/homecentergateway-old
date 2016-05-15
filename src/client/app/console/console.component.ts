import {Component, AfterViewInit} from '@angular/core';
import {SensorService} from '../sensor/sensor.service'

declare var kendoConsole: any;

@Component({
    selector: 'console',
    templateUrl: './app/console/console.component.html'
})

export class ConsoleComponent implements AfterViewInit {
    private sensorService: SensorService;

    constructor(private _sensorService: SensorService) {
        this.sensorService = this._sensorService;
    }

    ngAfterViewInit() {
        var messages = this.sensorService.getMessage();
        messages.forEach(function(msg) {
            kendoConsole.log(msg);
        })
    }
}