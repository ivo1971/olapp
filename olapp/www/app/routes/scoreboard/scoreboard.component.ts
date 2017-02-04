import {Component}            from '@angular/core';
import {Observable}           from 'rxjs/Observable';
import {OnInit}               from '@angular/core';
import {OnDestroy}            from '@angular/core';
import {Subscription}         from 'rxjs/Subscription';

import {TeamfieBaseComponent} from './../../classes/teamfie-base.class';

import {TeamInfo}             from './../../classes/team-info.class';
import {User}                 from './../../classes/user.class';

import {LogService }          from './../../services/log.service';
import {ModeService, EMode}   from './../../services/mode.service';
import {TeamfieService}       from './../../services/teamfie.service';
import {TeamsUsersService}    from './../../services/teams-users.service';
import {WebsocketUserService} from './../../services/websocket.user.service';

@Component({
    moduleId   : module.id,
    selector   : 'scoreboard',
    styleUrls  : [
        'scoreboard.component.css'
    ],
    templateUrl: 'scoreboard.component.html'
})
export class ScoreboardComponent extends TeamfieBaseComponent { 
    /* Private variables intended for the template
     * (hence at the top)
     */
    private showDummy : boolean = false;
    /* Construction
     */
    public constructor(
        private logService             : LogService,
        private modeService            : ModeService,
        private _teamfieService        : TeamfieService,
        private _teamsUsersService     : TeamsUsersService,
        private __websocketUserService : WebsocketUserService,
        ) { 
        //call base class
        super(_teamfieService, _teamsUsersService,__websocketUserService);

        //inform parent
        this.sendLocation("scoreboard");

        //additional initialization
        this.showDummy = !this.modeService.IsQuiz();

    }

    /* Event handlers called from the template
     */

    /* Private functions
     */

    /* Private members
     */
}
