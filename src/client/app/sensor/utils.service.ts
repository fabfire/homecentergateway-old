import {Injectable} from 'angular2/core';

@Injectable()
export class SensorUtilsService {
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
}