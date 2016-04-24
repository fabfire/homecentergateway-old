export class ProbeListData{
    pid: string;
    location: string;
    image: Object;
    numberofsensors:number;
    numberofmeasures:number;
    vcc:number;
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