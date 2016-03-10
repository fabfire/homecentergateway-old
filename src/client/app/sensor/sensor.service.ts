import {Injectable} from 'angular2/core';

@Injectable()
export class SensorService {
    messages: Array<String> = [];

    addMessage = (msg) => {
        this.messages.push(msg);
    };

    getMessage = () => {
        return this.messages;
    };
}

