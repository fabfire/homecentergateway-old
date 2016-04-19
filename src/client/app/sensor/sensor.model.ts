export class ProbeData{
    pid: string;
    location: string;
    startdate:Date;
    enddate:Date;
}

export class SensorData{
    id: string;
    pid: string;
    value: number;
    date:Date;
    type:string;
    name:string;
}

export interface HashTable<T> {
    [key: number]: T;
}