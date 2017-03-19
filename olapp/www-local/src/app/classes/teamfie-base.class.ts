import {ChangeDetectorRef}    from '@angular/core';
import {Component}            from '@angular/core';
import {IntervalObservable}   from 'rxjs/observable/IntervalObservable';
import {Observable}           from 'rxjs/Observable';
import {Subscription}         from 'rxjs/Subscription';

import {ComponentBase}        from './component-base.class';

import {TeamInfo}             from './team-info.class';
import {Teamfie}              from './teamfie.class';

import {TeamfieService}       from './../services/teamfie.service';
import {TeamsUsersService}    from './../services/teams-users.service';
import {WebsocketUserService} from './../services/websocket.user.service';

export class TeamfieBaseComponent extends ComponentBase { 
    /* Protected variables intended for the template
     * (hence at the top)
     */
    public teamInfos                    : Array<TeamInfo> = new Array<TeamInfo>();    
    public teamfies                     : Array<Teamfie>  = new Array<Teamfie> ();    
    public observableTeamInfo           : Observable<Array<TeamInfo>>;

    /* Construction
     */
    public constructor(
        private teamfieService        : TeamfieService,
        private teamsUsersService     : TeamsUsersService,
        private _websocketUserService : WebsocketUserService,
        ) { 
        //call base class
        super(_websocketUserService);

        //subscribe
        this.observableTeamInfo   = this.teamsUsersService.getObservableTeamsInfo();
        this.subscriptionTeamInfo = this.observableTeamInfo.subscribe((teamInfos: Array<TeamInfo>) => {
            this.teamInfos = teamInfos;
            this.merge();
        });
        this.observableTeamfie    = this.teamfieService.getObservableTeamfie();
        this.subscriptionTeamfie  = this.observableTeamfie.subscribe((teamfies: Array<Teamfie>) => {
            this.teamfies = teamfies;
            this.merge();
        });
    }

    public destructor() : void {
        this.subscriptionTeamfie.unsubscribe();
        this.subscriptionTeamInfo.unsubscribe();
    }

    /* Help functions
     */
    private merge() : void {
        for(let u : number = 0 ; u < this.teamInfos.length ; ++u) {
            if('undefined' === typeof(this.teamInfos[u].tmpPointsRound)) {
                this.teamInfos[u].tmpPointsRound = this.teamInfos[u].pointsRound;
            }

            let found : boolean = false;
            for(let v : number = 0 ; v < this.teamfies.length ; ++v) {
                if(this.teamInfos[u].id != this.teamfies[v].teamId) {
                    continue;
                }

                //decode the image info
                let endPosWidth  : number = this.teamfies[v].image.indexOf(",");
                let strWidth     : string = this.teamfies[v].image.substr(0, endPosWidth);
                let remainder    : string = this.teamfies[v].image.substr(endPosWidth + 1);
                let endPosHeight : number = remainder.indexOf(",");
                let strHeight    : string = remainder.substr(0, endPosHeight);
                this.teamInfos[u].imageEncoded = remainder.substr(endPosHeight + 1);
                this.teamInfos[u].imageWidth   = parseInt(strWidth);
                this.teamInfos[u].imageHeight  = parseInt(strHeight);
                found = true;
                break;
            }
            if(!found) {
                this.teamInfos[u].imageEncoded = "";
                this.teamInfos[u].imageWidth   = -1;
                this.teamInfos[u].imageHeight  = -1;
            }
        }
    }

    /* Private members
     */
    private   subscriptionTeamInfo           : Subscription;
    protected observableTeamfie              : Observable<Array<Teamfie>>;
    private   subscriptionTeamfie            : Subscription;
}
