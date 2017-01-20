import {Component}             from '@angular/core';
import {OnInit}                from '@angular/core';
import {Observable}            from 'rxjs/Observable';
import {Subscription}          from 'rxjs/Subscription';

import {ComponentBase}         from './../../classes/component-base.class';
import {TeamInfo}              from './../../classes/team-info.class';
import {UserInfo}              from './../../classes/user-info.class';

import {WebsocketUserService}  from './../../services/websocket.user.service';

function compareString(a: string, b: string) : number {
    //case-insensitive compare
    a = a.toLowerCase();
    b = b.toLowerCase();

    //compare
    if(a === b) {
        return 0;
    }
    if(a < b) {
        return -1;
    } else {
        return 1;
    }
}

function compareTeamInfo(a: TeamInfo, b: TeamInfo) : number {
    return compareString(a.name, b.name);
}

function compareUserInfo(a: UserInfo, b: UserInfo) : number {
    return compareString(a.name, b.name);
}

@Component({
    moduleId   : module.id,
    selector   : 'configure-teams-master',
    styleUrls  : [
        'configure-teams-master.component.css'
    ],
    templateUrl: 'configure-teams-master.component.html'
})
export class ConfigureTeamsMasterComponent extends ComponentBase implements OnInit { 
    private teamsInfo    : Array<TeamInfo> = [];
    private teamsInfoNone: Array<TeamInfo> = [];
    private usersInfo    : Array<UserInfo> = [];

    /* Construction
     */
    public constructor(
        private _websocketUserService : WebsocketUserService
        ) { 
        super(_websocketUserService);

        //fill-in structure for no-team item
        this.teamsInfoNone = [
            {
                id: "00000000-0000-0000-0000-000000000000",
                name: "no team"
            }
        ];
    }

    /* Life-cycle hooks
     */
    public ngOnInit() : void {
        //register routing MI for team-lists
        this.observableTeamInfo = this._websocketUserService
                                      .register("team-list")
        this.observableTeamInfoSubscription = this.observableTeamInfo.subscribe(data => {
            if(data && data["teams"]) {
                let teamsInfo : Array<TeamInfo> = data["teams"]
                teamsInfo.sort(compareTeamInfo);
                this.teamsInfo = teamsInfo;
            } else {
                this.teamsInfo = [];
            }
        });

        //register routing MI for user-lists
        this.observableUserInfo = this._websocketUserService
                                      .register("user-list")
        this.observableUserInfoSubscription = this.observableUserInfo.subscribe(data => {
            if(data && data["users"]) {
                let usersInfo : Array<UserInfo> = data["users"]
                usersInfo.sort(compareUserInfo);
                this.usersInfo = usersInfo;
            } else {
                this.usersInfo = [];
            }
        });
    }

    private observableTeamInfo             : Observable<TeamInfo>;
    private observableTeamInfoSubscription : Subscription        ;
    private observableUserInfo             : Observable<UserInfo>;
    private observableUserInfoSubscription : Subscription        ;
}
 