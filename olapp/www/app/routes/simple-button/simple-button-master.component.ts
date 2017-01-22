import {Component}            from '@angular/core';
import {Observable}           from 'rxjs/Observable';
import {OnInit}               from '@angular/core';
import {OnDestroy}            from '@angular/core';
import {Subscription}         from 'rxjs/Subscription';

import 'rxjs/add/operator/filter';

import {ComponentBase}        from './../../classes/component-base.class';
import {SimpleButtonInfo}     from './../../classes/simple-button-info.class';
import {SimpleButtonTeamInfo} from './../../classes/simple-button-info.class';
import {calculate}            from './../../classes/simple-button-info.class';

import {TeamInfo}              from './../../classes/team-info.class';
import {UserInfo}              from './../../classes/user-info.class';
import {User}                  from './../../classes/user.class';

import {LogService }           from './../../services/log.service';
import {ModeService, EMode}    from './../../services/mode.service';
import {TeamsUsersService}     from './../../services/teams-users.service';
import {UserService }          from './../../services/user.service';
import {WebsocketUserService}  from './../../services/websocket.user.service';

@Component({
    moduleId   : module.id,
    selector   : 'simple-button-master',
    styleUrls  : [
        'simple-button-master.component.css'
    ],
    templateUrl: 'simple-button-master.component.html'
})
export class SimpleButtonMasterComponent extends ComponentBase implements OnInit, OnDestroy { 
    private teamNameEvaluate : string = "";

    /* Construction
     */
    public constructor(
      private teamsUsersService : TeamsUsersService,
      private _websocketService : WebsocketUserService,
      ) {
        super(_websocketService);

        this.observableTeamInfo     = this.teamsUsersService.getObservableTeamsInfo    ();
        this.observableTeamInfoNone = this.teamsUsersService.getObservableTeamsInfoNone();
        this.observableUserInfo     = this.teamsUsersService.getObservableUsersInfo    ();
    }

    /* Life-cycle hooks
     */
    public ngOnInit() : void {
        //register routing MI
        this.observableEvaluate = this._websocketService
                                      .register("simple-button-evaluate")
        this.observableEvaluateSubscription = this.observableEvaluate.subscribe(
          data => {
            this.teamNameEvaluate = data["team"];
          });
    }

    public ngOnDestroy() : void {
    }

    /* Template event handlers
     */
    public onClickReset() : void {
        this._websocketService.sendMsg("simple-button-event", {
            event: "reset"
        });        
    }

    public onClickArm() : void {
        this._websocketService.sendMsg("simple-button-event", {
            event: "arm"
        });        
    }

    public onClickEvaluateBad() : void {
        this.evaluate("bad");
    }

    public onClickEvaluateGood() : void {
        this.evaluate("good");
    }

    private evaluate(evaluation: string) : void {
        let teamNameEvaluate = this.teamNameEvaluate;
        this.teamNameEvaluate = ""; //avoid double click on the same team
        this._websocketService.sendMsg("simple-button-event", {
            event: "evaluate",
            team: teamNameEvaluate,
            evaluation: evaluation
        });        
    }

    /* Private members
     */
    private observableTeamInfo             : Observable<Array<TeamInfo>>;
    private observableTeamInfoNone         : Observable<Array<TeamInfo>>;
    private observableUserInfo             : Observable<Array<UserInfo>>;
    private observableEvaluate             : Observable<any>;
    private observableEvaluateSubscription : Subscription                ;
}
