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
    @Input() inMaster             : boolean       = false;
    private  modeAnswering        : boolean       = true;
    private  dummies              : Array<string> = [];
    private  teamsAnswers         : Array<any>    = [];
    private  teamsEvaluations     : Array<any>    = [];

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
        this.observableQuestionsConfigure = this._websocketUserService
                                             .register("questions-configure")
        this.observableQuestionsConfigureSubscription = this.observableQuestionsConfigure.subscribe(
            data => {
                //this is a reset,
                //so start clean
                console.log("observableQuestionsConfigure in");
                let nbrOfQuestions           = data["nbrOfQuestions"];
                this.modeAnswering           = true;
                this.dummies.length          = 0;
                this.teamsAnswers.length     = 0;
                this.teamsEvaluations.length = 0;     
                for(let u : number = 0 ; u < nbrOfQuestions ; ++u) {
                    this.dummies.push(u.toString());
                }
                for(let u = 0 ; u < data["teams"].length ; ++u) {
                    //crete team
                    {
                        let team : any = {
                            id:              data["teams"][u].id,
                            name:            data["teams"][u].name,
                            questions:       new Array<string>(),
                        }
                        for(let u : number = 0 ; u < nbrOfQuestions ; ++u) {
                            team.qustions.push("");
                        }
                        this.teamsAnswers.push(team);
                    }

                    //create evaluation
                    {
                        let evaluation : any = {
                            id:              data["teams"][u].id,
                            name:            data["teams"][u].name,
                            evaluations:     new Array<boolean>(),
                            evaluationsDone: new Array<boolean>()
                        }
                        for(let u : number = 0 ; u < nbrOfQuestions ; ++u) {
                            evaluation.evaluations.push(false);
                            evaluation.evaluationsDone.push(false);
                        }
                        this.teamsEvaluations.push(evaluation);
                    }
                }
                console.log(this.teamsAnswers);
                console.log(this.teamsEvaluations);
                console.log("observableQuestionsConfigure out");
            }
        );

        this.observableQuestionsAction = this._websocketUserService
                                             .register("questions-action")
        this.observableQuestionsActionSubscription = this.observableQuestionsAction.subscribe(
            data => {
                this.modeAnswering = data["answering"]; 
                console.log("observableQuestionsAction [" + this.modeAnswering + "]");
            }
        );

        this.observableQuestionsTeamsAnswersAll = this._websocketUserService
                                             .register("questions-teams-answers-all")
        this.observableQuestionsTeamsAnswersAllSubscription = this.observableQuestionsTeamsAnswersAll.subscribe(
            data => {
                if((null == data) || ("undefined" !== typeof(data["teams"]))) {
                    //no info
                    return;
                }
                if(this.teamsAnswers.length != data["teams"].length) {
                    //length mismatch
                    this.logService.error("observableQuestionsTeamsAnswersAll length mismatch [" + this.teamsAnswers.length + "][" + data["teams"].length + "]");
                }
                console.log("observableQuestionsTeamsAnswersAll in");
                for(let u : number = 0 ; u < this.teamsAnswers.length ; ++u) {
                    for(let v : number = 0 ; v < this.teamsAnswers[u].answers.length ; ++v) {
                        this.teamsAnswers[u].answers[v] = data["teams"][u];
                    }
                }
                console.log(this.teamsAnswers);
                console.log("observableQuestionsTeamsAnswersAll out");
            }
        );

        this.observableQuestionsEvaluations = this._websocketUserService
                                             .register("questions-evaluations")
        this.observableQuestionsEvaluationsSubscription = this.observableQuestionsEvaluations.subscribe(
            data => {
                if((null == data) || ("undefined" !== typeof(data["evaluations"]))) {
                    //no info
                    return;
                }
                if(this.teamsEvaluations.length != data["evaluations"].length) {
                    //length mismatch
                    this.logService.error("observableQuestionsEvaluations length mismatch [" + this.teamsEvaluations.length + "][" + data["evaluations"].length + "]");
                }
                console.log("observableQuestionsEvaluations in");
                for(let u : number = 0 ; u < this.teamsEvaluations.length ; ++u) {
                    for(let v : number = 0 ; v < this.teamsEvaluations[u].evaluations.length ; ++v) {
                        this.teamsEvaluations[u].evaluations[v] = data["evaluations"][u].evaluations[v];
                    }
                    for(let v : number = 0 ; v < this.teamsEvaluations[u].evaluationsDone.length ; ++v) {
                        this.teamsEvaluations[u].evaluationsDone[v] = data["evaluations"][u].evaluationsDone[v];
                    }
                }
                console.log(this.teamsEvaluations);
                console.log("observableQuestionsEvaluations out");
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
        this.teamsEvaluations[teamIdx].evaluations[answerIdx] = checked;
    }

    private onClickAnswerEvaluated(answerIdx : number) : void {
        this.logService.log("onClickAnswerEvaluated [" + answerIdx + "]");
        for(let u = 0 ; u < this.teamsEvaluations.length ; ++u) {
            this.teamsEvaluations[u].evaluationsDone[answerIdx] = true;
        }
        console.log(this.teamsEvaluations);
        this._websocketUserService.sendMsg("questions-evaluations", {
            evaluations: this.teamsEvaluations
        });    
    }

    /* Private members
     */
    private observableQuestionsConfigure                   : Observable<any>;
    private observableQuestionsConfigureSubscription       : Subscription;
    private observableQuestionsAction                      : Observable<any>;
    private observableQuestionsActionSubscription          : Subscription;
    private observableQuestionsTeamsAnswersAll             : Observable<any>;
    private observableQuestionsTeamsAnswersAllSubscription : Subscription;
    private observableQuestionsEvaluations                 : Observable<any>;
    private observableQuestionsEvaluationsSubscription     : Subscription;
}
