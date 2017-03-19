import {Component}             from '@angular/core';
import {Input}                 from '@angular/core';
import {Observable}            from 'rxjs/Observable';
import {OnInit}                from '@angular/core';

import {TeamInfo}              from './../../classes/team-info.class';
import {UserInfo}              from './../../classes/user-info.class';

import {WebsocketUserService}  from './../../services/websocket.user.service';

@Component({
    moduleId   : module.id,
    selector   : 'team-info-list',
    styleUrls  : [
        'team-info-list.component.css'
    ],
    templateUrl: 'team-info-list.component.html'
})
export class TeamInfoListComponent implements OnInit { 
    @Input() alert       : boolean         = false;
    @Input() editTeams   : boolean         = true;
    @Input() editUsers   : boolean         = true;
    @Input() teamsInfo   : Array<TeamInfo> = [];
    @Input() teamsInfoAll: Array<TeamInfo> = [];
    @Input() usersInfo   : Array<UserInfo> = [];
    private  newTeamName : string          = "";

    /* Construction
     */
    public constructor(
        private websocketUserService : WebsocketUserService
        ) { 
    }

    /* Life-cycle hooks
     */
    public ngOnInit() : void {
    }

    /* Template event handlers
     */
    private onClickAddTeam(value: string) : void {
        //send the team name to the websocket
        this.websocketUserService.sendMsg("team-add", {
            teamId: this.getNewGUIDString(),
            teamName: this.newTeamName
        });

        //clear edit box
        this.newTeamName = "";
    }

    /* Help functions
     */
    private getNewGUIDString() {
        // your favourite guid generation function could go here
        // ex: http://stackoverflow.com/a/8809472/188246
        let d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
}
