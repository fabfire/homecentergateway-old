export class SensorData{
    id: string;
    value: number;
    date:Date;
    type:string;
    name:string;
}

export interface HashTable<T> {
    [key: number]: T;
}