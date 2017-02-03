import {BehaviorSubject}       from 'rxjs/BehaviorSubject';
import {Injectable }           from '@angular/core';
import {Observable}            from 'rxjs/Observable';
import {Subject}               from 'rxjs/Subject';
import {Subscription}          from 'rxjs/Subscription';

import {Teamfie}               from './../classes/teamfie.class';

import {LogService}            from './log.service';
import {WebsocketUserService}  from './websocket.user.service';

@Injectable()
export class TeamfieService {
    /**********************************************
     * Public construction/destruction
     */
    constructor(
        private logService           : LogService,
        private websocketUserService : WebsocketUserService
    ) {
        this.observableTeamfieIn = this.websocketUserService
                                      .register("teamfie")
        this.observableTeamfieSubscriptionIn = this.observableTeamfieIn.subscribe(data => {
            if(!data) {
                return;
            }
            this.logService.info("Adding [" + data["teamId"] + "] of size [" + data["image"].length + "]");
            this.teamfies[data["teamId"]] = data["image"];
        });
    }

    /**********************************************
     * Public methods
     */
    /*
    public getObservableTeamfie() : Observable<Teamfie> {
        return this.observableTeamfieOut;
    }
    */
    public getTeamfies() : {[key: string]: Teamfie} {
        return this.teamfies;
    }

    /**********************************************
     * Private members
     */
    //the actual data
    private teamfies                        : {[key: string]: Teamfie}     = {};
    //incoming observables: getting the data
    private observableTeamfieIn              : Observable<any>;
    private observableTeamfieSubscriptionIn  : Subscription        ;
    //outgoing: spreading the data
    //private subjectTeamfieOut                : BehaviorSubject<Teamfie>> = new BehaviorSubject<TeamInfo>>(this.teamsInfo);
}
