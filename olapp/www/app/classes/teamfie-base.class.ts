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
    protected teamInfos                    : Array<TeamInfo> = new Array<TeamInfo>();    
    protected teamfies                     : Array<Teamfie>  = new Array<Teamfie> ();    

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
            let found : boolean = false;
            for(let v : number = 0 ; v < this.teamfies.length ; ++v) {
                if(this.teamInfos[u].id != this.teamfies[v].teamId) {
                    continue;
                }
                this.teamInfos[u].image = this.teamfies[v].image;
                found = true;
                break;
            }
            if(!found) {
                this.teamInfos[u].image = "";
            }
        }
    }

    /* Private members
     */
    private observableTeamInfo             : Observable<Array<TeamInfo>>;
    private subscriptionTeamInfo           : Subscription;
    private observableTeamfie              : Observable<Array<Teamfie>>;
    private subscriptionTeamfie            : Subscription;
}
