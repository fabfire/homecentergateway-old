import {Component, OnInit} from '@angular/core';
import {SensorUtilsService} from '../sensor/utils.service'

declare var moment:any;

@Component({
    selector: 'control-sidebar',
    templateUrl: './app/layout/control-sidebar.component.html'
})
export class ControlSidebarComponent implements OnInit {
    private status;

    constructor(private _utilsService: SensorUtilsService) { }

    ngOnInit() {
        var $this = this;
        this._utilsService.getStatus().subscribe(data => {
            this.status = data;
            this.status.pm2.message.system_info.uptime = moment.duration(data.pm2.message.system_info.uptime * 1000).humanize();
        });
    }
}