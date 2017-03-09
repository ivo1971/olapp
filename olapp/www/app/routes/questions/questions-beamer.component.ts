import {Component}            from '@angular/core';
import {Input}                from '@angular/core';
import {Observable}           from 'rxjs/Observable';
import {OnInit}               from '@angular/core';
import {OnDestroy}            from '@angular/core';
import {Subscription}         from 'rxjs/Subscription';

import {ComponentBase}        from './../../classes/component-base.class';

import {LogService }          from './../../services/log.service';
import {ModeService, EMode}   from './../../services/mode.service';
import {WebsocketUserService} from './../../services/websocket.user.service';

@Component({
    moduleId   : module.id,
    selector   : 'questions-beamer',
    styleUrls  : [
        'questions.component.css',
        'questions-beamer.component.css'
    ],
    templateUrl: 'questions-beamer.component.html'
})
export class QuestionsBeamerComponent extends ComponentBase implements OnInit, OnDestroy { 
    /* Private variables intended for the template
     * (hence at the top)
     */
    @Input() inMaster         : boolean       = false;
    private  modeAnswering        : boolean       = true;
    private  dummies              : Array<string> = [];
    private  teamsAnswers         : Array<any>    = [];
    private  teamsEvaluationsMstr : Array<any>    = [];
    private  teamsEvaluations     : Array<any>    = [];
    private  teamsEvaluationsSet  : boolean       = false;

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
        //register routing MI
        this.observableQuestionsAction = this._websocketUserService
                                             .register("questions-action")
        this.observableQuestionsActionSubscription = this.observableQuestionsAction.subscribe(
            data => {
                this.modeAnswering = data["answering"]; 
            }
        );

        this.observableQuestionsTeamsAnswersAll = this._websocketUserService
                                             .register("questions-teams-answers-all")
        this.observableQuestionsTeamsAnswersAllSubscription = this.observableQuestionsTeamsAnswersAll.subscribe(
            data => {
                this.dummies.length              = 0;
                this.teamsAnswers.length         = 0;
                this.teamsEvaluations.length     = 0;
                this.teamsEvaluationsSet         = false;
                this.teamsEvaluationsMstr.length = 0;
                for(let u = 0 ; u < data["teams"].length ; ++u) {
                    if(0 == this.dummies.length) {
                        for(let v = 0 ; v < data["teams"][u]["answers"].length ; ++v) {
                            this.dummies.push("");
                        }    
                    }
                    this.teamsAnswers.push(data["teams"][u]);
                    let evaluation : any = {
                        id:              data["teams"][u].id,
                        evaluations:     new Array<boolean>(),
                        evaluationsDone: new Array<boolean>()
                    }
                    for(let v = 0 ; v < data["teams"][u]["answers"].length ; ++v) {
                        evaluation.evaluations.push(false);
                        evaluation.evaluationsDone.push(false);
                    }
                    this.teamsEvaluationsMstr.push(evaluation);
                }
            }
        );

        this.observableQuestionsEvaluations = this._websocketUserService
                                             .register("questions-evaluations")
        this.observableQuestionsEvaluationsSubscription = this.observableQuestionsEvaluations.subscribe(
            data => {
                this.teamsEvaluations.length     = 0;
                for(let u = 0 ; u < data["evaluations"].length ; ++u) {
                    this.teamsEvaluations.push(data["evaluations"][u]);
                }
                this.teamsEvaluationsSet = true;
                console.log(this.teamsEvaluations);
            }
        );
    }

    public ngOnDestroy() : void {
        this.observableQuestionsActionSubscription.unsubscribe();
        this.observableQuestionsTeamsAnswersAllSubscription.unsubscribe();
        this.observableQuestionsEvaluationsSubscription.unsubscribe();
    }

    /* Event handlers called from the template
     */

    /* Private functions
     */
    private onClickCheckboxEvaluate(teamIdx : number, answerIdx : number, checked: boolean) : void {
        this.logService.log("onClickCheckboxEvaluate [" + teamIdx + "][" + answerIdx + "][" + checked + "]");
        this.teamsEvaluationsMstr[teamIdx].evaluations[answerIdx] = checked;
    }

    private onClickAnswerEvaluated(answerIdx : number) : void {
        this.logService.log("onClickAnswerEvaluated [" + answerIdx + "]");
        for(let u = 0 ; u < this.teamsEvaluationsMstr.length ; ++u) {
            this.teamsEvaluationsMstr[u].evaluationsDone[answerIdx] = true;
        }
        this._websocketUserService.sendMsg("questions-evaluations", {
            evaluations: this.teamsEvaluationsMstr
        });    
    }

    /* Private members
     */
    private observableQuestionsAction                      : Observable<any>;
    private observableQuestionsActionSubscription          : Subscription;
    private observableQuestionsTeamsAnswersAll             : Observable<any>;
    private observableQuestionsTeamsAnswersAllSubscription : Subscription;
    private observableQuestionsEvaluations                 : Observable<any>;
    private observableQuestionsEvaluationsSubscription     : Subscription;
}
