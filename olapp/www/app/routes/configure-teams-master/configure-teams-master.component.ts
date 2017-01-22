import {Component}             from '@angular/core';
import {Observable}            from 'rxjs/Observable';

import {ComponentBase}         from './../../classes/component-base.class';
import {TeamInfo}              from './../../classes/team-info.class';
import {UserInfo}              from './../../classes/user-info.class';

import {TeamsUsersService}     from './../../services/teams-users.service';
import {WebsocketUserService}  from './../../services/websocket.user.service'

@Component({
    moduleId   : module.id,
    selector   : 'configure-teams-master',
    styleUrls  : [
        'configure-teams-master.component.css'
    ],
    templateUrl: 'configure-teams-master.component.html'
})
export class ConfigureTeamsMasterComponent extends ComponentBase { 
    /* Construction
     */
    public constructor(
        private teamsUsersService     : TeamsUsersService,
        private _websocketUserService : WebsocketUserService
        ) { 
        super(_websocketUserService);
        this.observableTeamInfo     = this.teamsUsersService.getObservableTeamsInfo    ();
        this.observableTeamInfoNone = this.teamsUsersService.getObservableTeamsInfoNone();
        this.observableUserInfo     = this.teamsUsersService.getObservableUsersInfo    ();
    }

    /* Private members
     */
    private observableTeamInfo             : Observable<Array<TeamInfo>>;
    private observableTeamInfoNone         : Observable<Array<TeamInfo>>;
    private observableUserInfo             : Observable<Array<UserInfo>>;
}
 