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
export class ScoreboardComponent extends TeamfieBaseComponent implements OnInit, OnDestroy { 
    /* Private variables intended for the template
     * (hence at the top)
     */
    public showDummy                 : boolean        = false;
    public total                     : boolean        = true;
    public observableScoreboardTotal : Observable<any>;

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

    /* Life-cycle hooks
     */
    public ngOnInit() : void {
        //register routing MI
        this.observableScoreboardTotal = this.__websocketUserService
                                             .register("scoreboard-total")
        this.observableScoreboardTotalSubscription = this.observableScoreboardTotal.subscribe(
          data => {
              this.total = data["total"];
          });
    }

    public ngOnDestroy() : void {
        this.observableScoreboardTotalSubscription.unsubscribe();
    }

    /* Event handlers called from the template
     */

    /* Private functions
     */

    /* Private members
     */
    private observableScoreboardTotalSubscription   : Subscription;
}
