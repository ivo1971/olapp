import {Component}            from '@angular/core';
import {Observable}           from 'rxjs/Observable';
import {OnInit}               from '@angular/core';
import {OnDestroy}            from '@angular/core';
import {Subscription}         from 'rxjs/Subscription';

import {ComponentBase}        from './../../classes/component-base.class';

import {LogService }          from './../../services/log.service';
import {ModeService, EMode}   from './../../services/mode.service';
import {WebsocketUserService} from './../../services/websocket.user.service';

class TeamQuestionsEvaluation {
    public id           : string = "";
    public name         : string = "";
    public nbrCorrect   : number = 0;
    public nbrEvaluated : number = 0;
    public pointsRound  : number = 0;
}

@Component({
    moduleId   : module.id,
    selector   : 'questions-master',
    styleUrls  : [
        'questions.component.css',
        'questions-master.component.css'
    ],
    templateUrl: 'questions-master.component.html'
})
export class QuestionsMasterComponent extends ComponentBase implements OnInit, OnDestroy { 
    /* Private variables intended for the template
     * (hence at the top)
     */
    private numberOfQuestions       : number                         = 10;
    private pointsPerQuestion       : number                         = 1;
    private resetConfirm            : boolean                        = false;
    private modeAnswering           : boolean                        = true;
    private teamQuestionsEvaluation : Array<TeamQuestionsEvaluation> = [];

    /* Construction
     */
    public constructor(
        private logService             : LogService,
        private modeService            : ModeService,
        private _websocketUserService : WebsocketUserService,
        ) { 
        //call base class
        super(_websocketUserService);

        //inform parent
        this.sendLocation("questions");
    }

    /* Life-cycle hooks
     */
    public ngOnInit() : void {
        this.observableQuestionsConfigure = this._websocketUserService
                                             .register("questions-configure-master")
        this.observableQuestionsConfigureSubscription = this.observableQuestionsConfigure.subscribe(
            data => {
                console.log(data);
                this.numberOfQuestions = data["nbrOfQuestions"]; 
                this.pointsPerQuestion = data["pointsPerQuestion"];
                console.log("observableQuestionsConfigure-master [" + this.numberOfQuestions + "][" + this.pointsPerQuestion + "]");
            }
        );

        this.observableQuestionsAction = this._websocketUserService
                                             .register("questions-action-master")
        this.observableQuestionsActionSubscription = this.observableQuestionsAction.subscribe(
            data => {
                this.modeAnswering = data["answering"]; 
                console.log("observableQuestionsAction-master [" + this.modeAnswering + "]");
            }
        );
    }

    public ngOnDestroy() : void {
    }

    /* Event handlers called from the template
     */
    private onClickSetNumberOfQuestionsOne() : void {
        console.log("onClickSetNumberOfQuestionsOne");
        this.resetConfirm = true;
    }

    private onClickSetNumberOfQuestionsCancel() : void {
        console.log("onClickSetNumberOfQuestionsCancel");
        this.resetConfirm = false;
    }

    private onClickSetNumberOfQuestionsTwo() : void {
        console.log("onClickSetNumberOfQuestionsTwo");
        this.resetConfirm = false;
        this._websocketUserService.sendMsg("questions-configure", {
            nbrOfQuestions:    this.numberOfQuestions,
            pointsPerQuestion: this.pointsPerQuestion
        });    
        this.onClickRadioAction(true);
        this.modeAnswering                  = true;
        this.teamQuestionsEvaluation.length = 0;
    }

    private onClickRadioAction(answering : boolean) : void {
        console.log("onClickRadioAction: [" + answering + "]");
        this.modeAnswering = answering;
        this._websocketUserService.sendMsg("questions-action", {
            answering: answering
        });        
    }

    private onPointsPerQuestionChange(pointsPerQuestion : number) : void {
        console.log("onPointsPerQuestionChange in  [" + pointsPerQuestion + "]");
        for(let u = 0 ; u < this.teamQuestionsEvaluation.length ; ++u) {
            this.teamQuestionsEvaluation[u].pointsRound  = this.teamQuestionsEvaluation[u].nbrCorrect   * this.pointsPerQuestion;
        }
        console.log(this.teamQuestionsEvaluation);
        console.log("onPointsPerQuestionChange out");
    }

    private onTeamEvaluationsEvt(teamQuestionsEvaluation : Array<any>) : void {
        console.log("onTeamEvaluationsEvt in  [" + teamQuestionsEvaluation.length + "]");
        this.teamQuestionsEvaluation.length = teamQuestionsEvaluation.length;
        for(let u = 0 ; u < teamQuestionsEvaluation.length ; ++u) {
            if("undefined" === typeof(this.teamQuestionsEvaluation[u])) {
                this.teamQuestionsEvaluation[u]          = new TeamQuestionsEvaluation();
            }
            this.teamQuestionsEvaluation[u].id           = teamQuestionsEvaluation[u].id           ;
            this.teamQuestionsEvaluation[u].name         = teamQuestionsEvaluation[u].name         ;
            this.teamQuestionsEvaluation[u].nbrCorrect   = teamQuestionsEvaluation[u].nbrCorrect   ;
            this.teamQuestionsEvaluation[u].nbrEvaluated = teamQuestionsEvaluation[u].nbrEvaluated ;
            this.teamQuestionsEvaluation[u].pointsRound  = teamQuestionsEvaluation[u].nbrCorrect   * this.pointsPerQuestion;
        }
        console.log(this.teamQuestionsEvaluation);
        console.log("onTeamEvaluationsEvt out [" + teamQuestionsEvaluation.length + "]");
    }

    private onClickSetPoints() : void {
        //send message to set points
        this._websocketUserService.sendMsg("questions-set-points", {
            teams : this.teamQuestionsEvaluation
        });        

        //route to the scoreboard
        this._websocketUserService.sendMsg("select-mode", {
            mode: "scoreboard"
        });
    }

    /* Private functions
     */

    /* Private members
     */
    private observableQuestionsConfigure                   : Observable<any>;
    private observableQuestionsConfigureSubscription       : Subscription;
    private observableQuestionsAction                      : Observable<any>;
    private observableQuestionsActionSubscription          : Subscription;
}
