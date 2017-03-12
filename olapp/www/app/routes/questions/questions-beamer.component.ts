import {Component}            from '@angular/core';
import {EventEmitter}         from '@angular/core';
import {Input}                from '@angular/core';
import {Observable}           from 'rxjs/Observable';
import {OnInit}               from '@angular/core';
import {OnDestroy}            from '@angular/core';
import {Output}               from '@angular/core';
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
    @Input()  inMaster             : boolean       = false;
    private   modeAnswering        : boolean       = true;
    private   dummies              : Array<string> = [];
    private   teamsAnswers         : Array<any>    = [];
    private   teamsEvaluations     : Array<any>    = [];
    @Output() teamEvaluationsEvt   : EventEmitter<Array<any>> = new EventEmitter<Array<any>>();

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
        //init events
        {
            let teamEvaluations  : Array<any> = [];
            this.teamEvaluationsEvt.next(teamEvaluations);
        }
        
        //register routing MI
        this.observableQuestionsAction = this._websocketUserService
                                             .register("questions-action")
        this.observableQuestionsActionSubscription = this.observableQuestionsAction.subscribe(
            data => {
                this.modeAnswering = data["answering"]; 
                console.log("observableQuestionsAction [" + this.modeAnswering + "]");
            }
        );

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
                console.log("observableQuestionsConfigure out");
            }
        );

        this.observableQuestionsTeamsAnswersAll = this._websocketUserService
                                             .register("questions-teams-answers-all")
        this.observableQuestionsTeamsAnswersAllSubscription = this.observableQuestionsTeamsAnswersAll.subscribe(
            data => {
                console.log("observableQuestionsTeamsAnswersAll check");
                if((null == data) || ("undefined" === typeof(data["teams"]))) {
                    //no info
                    console.log("observableQuestionsTeamsAnswersAll check no info");
                    return;
                }
                //valid data
                console.log("observableQuestionsTeamsAnswersAll in");

                let evaluationsInit          = 0 == this.teamsEvaluations.length;
                this.teamsAnswers.length     = data["teams"].length;
                this.teamsEvaluations.length = data["teams"].length;
                for(let u = 0 ; u < data["teams"].length ; ++u) {
                    this.dummies.length = data["teams"][u]["answers"].length;
                    this.teamsAnswers[u] = data["teams"][u];
                    if(evaluationsInit) {
                        let evaluation : any = {
                            id:              data["teams"][u].id,
                            name:            data["teams"][u].name,
                            nbrCorrect:      0,
                            nbrEvaluated:    0,
                            evaluations:     new Array<boolean>(),
                            evaluationsDone: new Array<boolean>()
                        }
                        console.log("observableQuestionsTeamsAnswersAll name [" + evaluation.name + "]");
                        for(let v = 0 ; v < data["teams"][u]["answers"].length ; ++v) {
                            evaluation.evaluations.push(false);
                            evaluation.evaluationsDone.push(false);
                        }
                        this.teamsEvaluations[u] = evaluation;
                    }
                }
                console.log(this.dummies);
                console.log(this.teamsAnswers);
                console.log(this.teamsEvaluations);
                console.log("observableQuestionsTeamsAnswersAll out");
            }
        );

        this.observableQuestionsEvaluations = this._websocketUserService
                                             .register("questions-evaluations")
        this.observableQuestionsEvaluationsSubscription = this.observableQuestionsEvaluations.subscribe(
            data => {
                console.log("observableQuestionsEvaluations check");
                if((null == data) || ("undefined" === typeof(data["evaluations"]))) {
                    //no info
                    console.log("observableQuestionsEvaluations check no info");
                    return;
                }
                if(this.teamsEvaluations.length != data["evaluations"].length) {
                    //length mismatch
                    this.logService.error("observableQuestionsEvaluations length mismatch [" + this.teamsEvaluations.length + "][" + data["evaluations"].length + "]");
                    console.log(data);
                }
                //valid data

                console.log("observableQuestionsEvaluations in");
                for(let u = 0 ; u < data["evaluations"].length ; ++u) {
                    this.teamsEvaluations[u] = data["evaluations"][u];
                }

                //spread the news
                this.teamEvaluationsEvt.next(this.teamsEvaluations);
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
        //set this question to evaluated
        for(let u = 0 ; u < this.teamsEvaluations.length ; ++u) {
            this.teamsEvaluations[u].evaluationsDone[answerIdx] = true;
        }

        //count points
        for(let u = 0 ; u < this.teamsEvaluations.length ; ++u) {
            this.teamsEvaluations[u].nbrCorrect   = 0;
            this.teamsEvaluations[u].nbrEvaluated = 0;
            for(let v = 0 ; v < this.teamsEvaluations[u].evaluationsDone.length ; ++v) {
                if(!this.teamsEvaluations[u].evaluationsDone[v]) {
                    continue;
                }
                ++this.teamsEvaluations[u].nbrEvaluated;
                if(!this.teamsEvaluations[u].evaluations[v]) {
                    continue;
                }
                ++this.teamsEvaluations[u].nbrCorrect;
            }
        }

        //spread the news
        this._websocketUserService.sendMsg("questions-evaluations", {
            evaluations: this.teamsEvaluations
        });    
        this.teamEvaluationsEvt.next(this.teamsEvaluations);
    }

    /* Private members
     */
    private observableQuestionsAction                      : Observable<any>;
    private observableQuestionsActionSubscription          : Subscription;
    private observableQuestionsConfigure                   : Observable<any>;
    private observableQuestionsConfigureSubscription       : Subscription;
    private observableQuestionsTeamsAnswersAll             : Observable<any>;
    private observableQuestionsTeamsAnswersAllSubscription : Subscription;
    private observableQuestionsEvaluations                 : Observable<any>;
    private observableQuestionsEvaluationsSubscription     : Subscription;
}