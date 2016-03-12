export class SensorData{
    nodeid: number;
    value: number;
    date:Date;
    type:string
}

export interface HashTable<T> {
    [key: number]: T;
}