import {Component}            from '@angular/core';
import {Observable}           from 'rxjs/Observable';
import {OnInit}               from '@angular/core';
import {OnDestroy}            from '@angular/core';
import {Subscription}         from 'rxjs/Subscription';

import {ComponentBase}        from './../../classes/component-base.class';

import {TeamInfo}              from './../../classes/team-info.class';
import {User}                  from './../../classes/user.class';

import {LogService }           from './../../services/log.service';
import {ModeService, EMode}    from './../../services/mode.service';
import {TeamsUsersService}     from './../../services/teams-users.service';
import {WebsocketUserService}  from './../../services/websocket.user.service';

@Component({
    moduleId   : module.id,
    selector   : 'scoreboard',
    styleUrls  : [
        'scoreboard.component.css'
    ],
    templateUrl: 'scoreboard.component.html'
})
export class ScoreboardComponent extends ComponentBase implements OnInit, OnDestroy { 
    /* Private variables intended for the template
     * (hence at the top)
     */

    /* Construction
     */
    public constructor(
      private logService        : LogService,
      private modeService       : ModeService,
      private teamsUsersService : TeamsUsersService,
      private _websocketService : WebsocketUserService,
      ) {
          //call base class
          super(_websocketService);

          //additional initialization
          this.observableTeamInfo     = this.teamsUsersService.getObservableTeamsInfo    ();
    }

    /* Life-cycle hooks
     */
    public ngOnInit() : void {
        //inform parent
        this.sendLocation("scoreboard");
    }

    public ngOnDestroy() {
    }

    /* Event handlers called from the template
     */

    /* Private functions
     */

    /* Private members
     */
    private observableTeamInfo         : Observable<Array<TeamInfo>>;
}
