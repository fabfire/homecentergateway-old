import {Component, OnInit} from '@angular/core';
import {UserService} from '../user/user.service'

@Component({
    selector: 'main-header',
    templateUrl: './app/layout/main-header.component.html'
})
export class MainHeaderComponent implements OnInit {
    private profile: any;

    constructor(private _userService: UserService) { }

    ngOnInit() {
        this._userService.getProfile().subscribe(data => {
            this.profile = data;
        });
    }

}