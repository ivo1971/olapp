import {Component}             from '@angular/core';
import {OnInit}                from '@angular/core';
import {Observable}            from 'rxjs/Observable';
import {Subscription}          from 'rxjs/Subscription';

import {ComponentBase}         from './../../classes/component-base.class';
import {TeamInfo}              from './../../classes/team-info.class';
import {UserInfo}              from './../../classes/user-info.class';

import {WebsocketUserService}  from './../../services/websocket.user.service';

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
        //register routing MI
        this.observableTeamInfo = this._websocketUserService
                                      .register("team-list")
        this.observableTeamInfoSubscription = this.observableTeamInfo.subscribe(data => {
            console.log(data);
            if(data && data["teams"]) {
                this.teamsInfo = data["teams"];
            } else {
                this.teamsInfo = [];
            }
            console.log(this.teamsInfo);
        });
        this.observableUserInfo = this._websocketUserService
                                      .register("user-list")
        this.observableUserInfoSubscription = this.observableUserInfo.subscribe(data => {
            console.log(data);
            if(data && data["users"]) {
                this.usersInfo = data["users"];
            } else {
                this.usersInfo = [];
            }
            console.log(this.usersInfo);
        });
    }

    private observableTeamInfo             : Observable<TeamInfo>;
    private observableTeamInfoSubscription : Subscription        ;
    private observableUserInfo             : Observable<UserInfo>;
    private observableUserInfoSubscription : Subscription        ;
}
 