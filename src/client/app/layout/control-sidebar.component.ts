import {Component, OnInit} from '@angular/core';
import {SensorUtilsService} from '../sensor/utils.service'

declare var moment: any;
declare var toastr: any;
var $this;

@Component({
    selector: 'control-sidebar',
    templateUrl: './app/layout/control-sidebar.component.html'
})
export class ControlSidebarComponent implements OnInit {
    private status;
    private previousStatus;

    constructor(private _utilsService: SensorUtilsService) { }

    ngOnInit() {
        $this = this;
        this.checkStatus();
        setInterval(function () {
            $this.checkStatus();
        }, 60000);
    }

    checkStatus() {
        this._utilsService.getStatus().subscribe(data => {
            this.status = data;
            if (data.pm2.message.system_info && data.pm2.message.system_info.uptime) {
                this.status.pm2.message.system_info.uptime = moment.duration(data.pm2.message.system_info.uptime * 1000).humanize();
            }
            if (data.nodejs.status !== 'green') {
                toastr.error('Serveur NodeJS indisponible !');
            }
            else if (this.previousStatus && this.previousStatus.nodejs.status !== 'green') {
                toastr.success('Serveur NodeJS en ligne !')
            }

            if (data.elastic.status !== 'green') {
                toastr.error('Serveur ElasticSearch indisponible !');
            }
            else if (this.previousStatus && this.previousStatus.elastic.status !== 'green') {
                toastr.success('Serveur ElasticSearch en ligne !')
            }

            if (data.pm2.status !== 'green') {
                toastr.error('Monitoring PM2 indisponible !');
            }
            else if (this.previousStatus && this.previousStatus.pm2.status !== 'green') {
                toastr.success('Monitoring PM2 en ligne !')
            }

            this.previousStatus = this.status;
        },
            err => {
                this.status = undefined;
                toastr.error('Serveur NodeJS indisponible !', '', {
                    "closeButton": true,
                    "preventDuplicates": true,
                    "positionClass": "toast-bottom-right",
                    "hideDuration": "0",
                    "timeOut": "0",
                });
            }
        );
    }
}