import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class SensorUtilsService {
    constructor(private http: Http) { }

    getStatus = () => {
        return this.http.get("api/status")
            .map(response => response.json())
            .catch(this.handleError);
    };
    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? '${error.status} - ${error.statusText}' : 'Server error';
        console.error('error getting status', errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

    getTypeLabel = (type: string) => {
        var str;
        switch (type) {
            case "temp":
                str = "Température";
                break;
            case "hum":
                str = "Humidité";
                break;
            case "pres":
                str = "Pression";
                break;
            case "vcc":
                str = "VCC";
                break;
            default:
                str = type;
                break;
        };
        return str;
    };

    getTypeColor = (type: string) => {
        var str;
        switch (type) {
            case "temp":
                str = "bg-yellow";
                break;
            case "hum":
                str = "bg-aqua";
                break;
            case "pres":
                str = "bg-green";
                break;
            case "vcc":
                str = "bg-red";
                break;
        };
        return str;
    };

    getTypeAxisLabel = (type: string) => {
        var str;
        switch (type) {
            case "temp":
                str = "Temperature (°C)";
                break;
            case "hum":
                str = "Humidité (%)";
                break;
            case "pres":
                str = "Pression (mb)";
                break;
            case "vcc":
                str = "Voltage (V)";
                break;
        };
        return str;
    };
}