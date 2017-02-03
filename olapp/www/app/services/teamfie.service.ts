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
            for(let u = 0 ; u < this.teamfies.length ; ++u) {
                if(this.teamfies[u].teamId === data["teamId"]) {
                    //id already in the list --> update
                    this.logService.info("Replacing [" + data["teamId"] + "] of size [" + data["image"].length + "]");
                    this.teamfies[u].image = data["image"]
                    this.subjectTeamfieOut.next(this.teamfies);
                    return; 
                }
            }
            this.logService.info("Adding [" + data["teamId"] + "] of size [" + data["image"].length + "]");
            this.teamfies.push(new Teamfie(data["teamId"], data["image"]));
            this.subjectTeamfieOut.next(this.teamfies);
        });
    }

    /**********************************************
     * Public methods
     */
    public getObservableTeamfie() : Observable<Array<Teamfie>> {
        return this.observableTeamfieOut;
    }

    /**********************************************
     * Private members
     */
    //the actual data
    private teamfies                        : Array<Teamfie>     = new Array<Teamfie>();
    //incoming observables: getting the data
    private observableTeamfieIn              : Observable<any>;
    private observableTeamfieSubscriptionIn  : Subscription        ;
    //outgoing: spreading the data
    private subjectTeamfieOut                : BehaviorSubject<Array<Teamfie>> = new BehaviorSubject<Array<Teamfie>>(this.teamfies);
    private observableTeamfieOut             : Observable<Array<Teamfie>>      = this.subjectTeamfieOut.asObservable();
}
