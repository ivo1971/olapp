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
    selector   : 'scoreboard-master',
    styleUrls  : [
        'scoreboard-master.component.css'
    ],
    templateUrl: 'scoreboard-master.component.html'
})
export class ScoreboardMasterComponent extends TeamfieBaseComponent { 
    /* Private variables intended for the template
     * (hence at the top)
     */

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
    }

    /* Life-cycle hooks
     */
    public ngOnInit() : void {
        for(let u : number = 0 ; u < this.teamInfos.length ; ++u) {
            this.teamInfos[u].tmpPointsRound = this.teamInfos[u].pointsRound;
        }
    }

    /* Event handlers called from the template
     */
    private onClickRadioTotal(total : boolean) : void {
        this.__websocketUserService.sendMsg("scoreboard-total", {
            total: total
        });        
    }

    private onClickClear() : void {
        this.clearTmpRoundPoints();
    }

    private onClickSetPointsRound() : void {
        class TeamMap {
            [teamId: string]: number;
        }

        //switch to round-mode in any case
        this.onClickRadioTotal(false);
        
        //compose info
        let data : TeamMap = new TeamMap();
        for(let u : number = 0 ; u < this.teamInfos.length ; ++u) {
            data[this.teamInfos[u].id]       = this.teamInfos[u].tmpPointsRound;
        }

        //send
        this.__websocketUserService.sendMsg("scoreboard-set-points-round", {
            round: data
        });    
    }

    private onClickPointsRound2Total() : void {
        //send
        this.__websocketUserService.sendMsg("scoreboard-points-round-2-total", {
        });    

        //clear
        this.clearTmpRoundPoints();

        //switch to total-mode in any case
        this.onClickRadioTotal(true);
        
    }

    /* Private functions
     */
    private clearTmpRoundPoints() : void {
        for(let u : number = 0 ; u < this.teamInfos.length ; ++u) {
            this.teamInfos[u].tmpPointsRound = 0;
        }
    }

    /* Private members
     */
}
