import {BehaviorSubject}           from 'rxjs/BehaviorSubject';
import {Injectable }           from '@angular/core';
import {Observable}            from 'rxjs/Observable';
import {Subject}               from 'rxjs/Subject';
import {Subscription}          from 'rxjs/Subscription';

import {compareString}         from './../help/string';

import {TeamInfo}              from './../classes/team-info.class';
import {UserInfo}              from './../classes/user-info.class';

import {LogService}            from './log.service';
import {WebsocketUserService}  from './websocket.user.service';

function compareTeamInfo(a: TeamInfo, b: TeamInfo) : number {
    return compareString(a.name, b.name);
}

function compareUserInfo(a: UserInfo, b: UserInfo) : number {
    return compareString(a.name, b.name);
}

@Injectable()
export class TeamsUsersService {
    /**********************************************
     * Public construction/destruction
     */
    constructor(
        private logService           : LogService,
        private websocketUserService : WebsocketUserService
    ) {
        //init static team-info-none
        this.teamsInfoNone = [
            {
                id: "00000000-0000-0000-0000-000000000000",
                name: "no team",
                pointsRound: 0,
                pointsTotal: 0
            }
        ];
        this.subjectTeamsInfoNoneOut.next(this.teamsInfoNone);                            

        //register routing MI for team-lists
        this.observableTeamInfoIn = this.websocketUserService
                                      .register("team-list")
        this.observableTeamInfoSubscriptionIn = this.observableTeamInfoIn.subscribe(data => {
            if(data && data["teams"]) {
                let teamsInfo : Array<TeamInfo> = data["teams"]
                teamsInfo.sort(compareTeamInfo);
                this.teamsInfo = teamsInfo;
            } else {
                this.teamsInfo = [];
            }
            this.subjectTeamsInfoOut.next(this.teamsInfo);                            
        });

        //register routing MI for user-lists
        this.observableUserInfoIn = this.websocketUserService
                                      .register("user-list")
        this.observableUserInfoSubscriptionIn = this.observableUserInfoIn.subscribe(data => {
            if(data && data["users"]) {
                let usersInfo : Array<UserInfo> = data["users"]
                usersInfo.sort(compareUserInfo);
                this.usersInfo = usersInfo;
            } else {
                this.usersInfo = [];
            }
            this.subjectUsersInfoOut.next(this.usersInfo);                            
        });
    }

    /**********************************************
     * Public methods
     */
    public getObservableTeamsInfo() : Observable<Array<TeamInfo>> {
        return this.observableTeamsInfoOut;
    }

    public getObservableTeamsInfoNone() : Observable<Array<TeamInfo>> {
        return this.observableTeamsInfoNoneOut;
    }

    public getObservableUsersInfo() : Observable<Array<UserInfo>> {
        return this.observableUsersInfoOut;
    }

    /**********************************************
     * Private members
     */
    //the actual data
    private teamsInfo                        : Array<TeamInfo>     = [];
    private teamsInfoNone                    : Array<TeamInfo>     = [];
    private usersInfo                        : Array<UserInfo>     = [];
    //incoming observables: getting the data
    private observableTeamInfoIn             : Observable<TeamInfo>;
    private observableTeamInfoSubscriptionIn : Subscription        ;
    private observableUserInfoIn             : Observable<UserInfo>;
    private observableUserInfoSubscriptionIn : Subscription        ;
    //outgoing: spreading the data
    private subjectTeamsInfoOut              : BehaviorSubject<Array<TeamInfo>> = new BehaviorSubject<Array<TeamInfo>>(this.teamsInfo);
    private observableTeamsInfoOut           : Observable<Array<TeamInfo>>      = this.subjectTeamsInfoOut.asObservable();
    private subjectTeamsInfoNoneOut          : BehaviorSubject<Array<TeamInfo>> = new BehaviorSubject<Array<TeamInfo>>([]);
    private observableTeamsInfoNoneOut       : Observable<Array<TeamInfo>>      = this.subjectTeamsInfoNoneOut.asObservable();
    private subjectUsersInfoOut              : BehaviorSubject<Array<UserInfo>> = new BehaviorSubject<Array<UserInfo>>(this.usersInfo);
    private observableUsersInfoOut           : Observable<Array<UserInfo>>      = this.subjectUsersInfoOut.asObservable();
}
