export class ProbeData {
    pid: string;
    location: string;
    image: Object;
    numberofsensors: number;
    numberofmeasures: number;
    vcc: number;
}

export class ProbeDetailData {
    pid: string;
    sensorstats: SensorStats[];
}

export class SensorStats {
    sensordata: SensorData;
    count: number;
}

export class SensorData {
    id: string;
    pid: string;
    value: number;
    date: Date;
    minDate: Date;
    type: string;
    name: string;
}

export class PointEditData {
    date: string;
    value: number;
    id:string;
    index:number;
    category:any;
}
export interface HashTable<T> {
    [key: number]: T;
}