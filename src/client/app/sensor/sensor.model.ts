export class SensorData{
    nodeid: number;
    value: number;
    date:Date;
}

export interface HashTable<T> {
    [key: number]: T;
}