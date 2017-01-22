import {Component}             from '@angular/core';
import {Input}                 from '@angular/core';
import {OnInit}                from '@angular/core';

import {TeamInfo}              from './../../classes/team-info.class';
import {UserInfo}              from './../../classes/user-info.class';

@Component({
    moduleId   : module.id,
    selector   : 'user-info-list',
    styleUrls  : [
        'user-info-list.component.css'
    ],
    templateUrl: 'user-info-list.component.html'
})
export class UserInfoListComponent implements OnInit { 
    @Input() alert       : boolean         = false;
    @Input() edit       : boolean          = true;
    @Input() team        : TeamInfo        = new TeamInfo();
    @Input() teamsInfoAll: Array<TeamInfo> = [];
    @Input() usersInfo   : Array<UserInfo> = [];

    /* Life-cycle hooks
     */
    public ngOnInit() : void {
    }
}
