import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

@Injectable()
export class UserService {
    constructor(private http: Http) { }
    
    getProfile = () => {
        return this.http.get("api/profile")
            .map(response => response.json());
    };
}