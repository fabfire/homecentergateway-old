import {Component, AfterViewInit} from '@angular/core';
import {CanReuse, OnReuse, ComponentInstruction} from '@angular/router-deprecated';
import {SensorService} from '../sensor/sensor.service'

declare var kendoConsole: any;

@Component({
    selector: 'console',
    templateUrl: './app/console/console.component.html'
})

export class ConsoleComponent implements CanReuse, AfterViewInit {
    private sensorService: SensorService;

    constructor(private _sensorService: SensorService) {
        this.sensorService = this._sensorService;
    }

    routerCanReuse(next: ComponentInstruction, prev: ComponentInstruction) { return true; }
    ngAfterViewInit() {
        var messages = this.sensorService.getMessage();
        messages.forEach(function(msg) {
            kendoConsole.log(msg);
        })
    }
}