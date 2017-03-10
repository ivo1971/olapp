import {Component}            from '@angular/core';
import {Observable}           from 'rxjs/Observable';
import {OnInit}               from '@angular/core';
import {OnDestroy}            from '@angular/core';
import {Subscription}         from 'rxjs/Subscription';

import {ComponentBase}        from './../../classes/component-base.class';

import {User}                 from './../../classes/user.class';

import {LogService }          from './../../services/log.service';
import {ModeService, EMode}   from './../../services/mode.service';
import {UserService}          from './../../services/user.service';
import {WebsocketUserService} from './../../services/websocket.user.service';

class Question {
    public answer : string = "";

    public constructor(anwr : string = "") {
        this.answer = anwr;
    }
}

@Component({
    moduleId   : module.id,
    selector   : 'questions',
    styleUrls  : [
        'questions.component.css'
    ],
    templateUrl: 'questions.component.html'
})
export class QuestionsComponent extends ComponentBase implements OnInit, OnDestroy { 
    /* Private variables intended for the template
     * (hence at the top)
     */
    private modeAnswering            : boolean    = true;
    private questions                : Question[] = [];
    private questionsNbrOk           : number     = 0;
    private questionsNbrTotal        : number     = 0;
    private questionsNbrShow         : boolean    = false;
    private teamsEvaluations         : Array<any> = [];
    private teamsEvaluationsIdx      : number     = -1;
    private teamsEvaluationsIdxStored: number     = -1;
    private userInfo                 : User       = new User();

    /* Construction
     */
    public constructor(
        private logService             : LogService,
        private modeService            : ModeService,
        private usersService           : UserService,
        private _websocketUserService  : WebsocketUserService,
        ) { 
        //call base class
        super(_websocketUserService);

        //inform parent
        this.sendLocation("questions");

        //get user info
        this.userServiceSubscription = this.usersService.getObservableUser().subscribe(
          user => {
            this.userInfo = user;
            console.log(this.userInfo);
          });

    }

    public destructor() {
        this.userServiceSubscription.unsubscribe();
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
                let nbrOfQuestions     = data["nbrOfQuestions"];
                this.questions.length  = 0;
                for(let u = 0 ; u < nbrOfQuestions ; ++u) {
                    this.questions.push(new Question());
                }
                console.log("config [" + nbrOfQuestions + "]")
            }
        );

        this.observableQuestionsAnswerUpdateOne = this._websocketUserService
                                             .register("questions-answer-update-one")
        this.observableQuestionsAnswerUpdateOneSubscription = this.observableQuestionsAnswerUpdateOne.subscribe(
            data => {
                let idx    : number = data["idx"];
                let answer : string = data["answer"];
                if(this.questions.length <= idx) {
                    this.logService.error("questions-answer-update-one index [" + idx + "] too big (max: [" + this.questions.length + "])");
                    return;
                }
                this.questions[idx].answer = answer; 
            }
        );

        this.observableQuestionsAnswerUpdateAll = this._websocketUserService
                                             .register("questions-answer-update-all")
        this.observableQuestionsAnswerUpdateAllSubscription = this.observableQuestionsAnswerUpdateAll.subscribe(
            data => {
                for(let u = 0 ; u < data["answers"].length ; ++u) {
                    let idx    : number = data["answers"][u]["idx"];
                    let answer : string = data["answers"][u]["answer"];
                    if(this.questions.length <= idx) {
                        this.logService.error("questions-answer-update-all index [" + idx + "] too big (max: [" + this.questions.length + "])");
                        return;
                    }
                    this.questions[idx].answer = answer; 
                }
            }
        );

        this.observableQuestionsAction = this._websocketUserService
                                             .register("questions-action")
        this.observableQuestionsActionSubscription = this.observableQuestionsAction.subscribe(
            data => {
                this.modeAnswering = data["answering"]; 
                if(this.modeAnswering) {
                    this.teamsEvaluationsIdx     = -1;
                    this.teamsEvaluations.length = 0;
                } else {
                    this.teamsEvaluationsIdx = this.teamsEvaluationsIdxStored;
                }
            }
        );

        this.observableQuestionsEvaluations = this._websocketUserService
                                             .register("questions-evaluations")
        this.observableQuestionsEvaluationsSubscription = this.observableQuestionsEvaluations.subscribe(
            data => {
                this.teamsEvaluations.length     = 0;
                this.teamsEvaluationsIdx         = -1;
                for(let u = 0 ; u < data["evaluations"].length ; ++u) {
                    this.teamsEvaluations.push(data["evaluations"][u]);
                    if(this.userInfo.teamId == data["evaluations"][u].id) {
                        this.teamsEvaluationsIdx = u;    
                    }
                }
                this.teamsEvaluationsIdxStored = this.teamsEvaluationsIdx;
            }
        );
    }

    public ngOnDestroy() : void {
        this.observableQuestionsConfigureSubscription.unsubscribe();
        this.observableQuestionsAnswerUpdateOneSubscription.unsubscribe();
        this.observableQuestionsAnswerUpdateAllSubscription.unsubscribe();
        this.observableQuestionsActionSubscription.unsubscribe();
        this.observableQuestionsEvaluationsSubscription.unsubscribe();
    }

    /* Event handlers called from the template
     */
    private valueChanged(idx : number, answer: string) : void {
        this.questions[idx].answer = answer; 
        this._websocketUserService.sendMsg("questions-answer", {
            idx: idx,
            answer: answer
        });    
    }

    /* Private functions
     */

    /* Private members
     */
    private userServiceSubscription                       : Subscription;
    private observableQuestionsConfigure                   : Observable<any>;
    private observableQuestionsConfigureSubscription       : Subscription;
    private observableQuestionsAnswerUpdateOne             : Observable<any>;
    private observableQuestionsAnswerUpdateOneSubscription : Subscription;
    private observableQuestionsAnswerUpdateAll             : Observable<any>;
    private observableQuestionsAnswerUpdateAllSubscription : Subscription;
    private observableQuestionsAction                      : Observable<any>;
    private observableQuestionsActionSubscription          : Subscription;
    private observableQuestionsEvaluations                 : Observable<any>;
    private observableQuestionsEvaluationsSubscription     : Subscription;
}
