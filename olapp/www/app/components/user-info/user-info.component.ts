import {Component}             from '@angular/core';
import {Input}                 from '@angular/core';

import {TeamInfo}              from './../../classes/team-info.class';
import {UserInfo}              from './../../classes/user-info.class';

import {WebsocketUserService}  from './../../services/websocket.user.service';

@Component({
    moduleId   : module.id,
    selector   : 'user-info',
    styleUrls  : [
        'user-info.component.css',
        '../status-bar/status-bar.component.css'
    ],
    templateUrl: 'user-info.component.html'
})
export class UserInfoComponent  { 
    @Input() user        : UserInfo;
    @Input() teamsInfoAll: Array<TeamInfo> ;

    /* Construction
     */
    public constructor(
        private websocketUserService : WebsocketUserService
        ) { 
    }

    /* Template event handlers
     */
    private onSelectionChange(value : string) : void {
        console.log(value);
        console.log(this.user);
        console.log({
            userId: this.user.id,
            teamId: value
        });
        //send the team name to the websocket
        this.websocketUserService.sendMsg("user-select-team", {
            userId: this.user.id,
            teamId: value
        });
    }
}
