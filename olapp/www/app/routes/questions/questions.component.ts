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

/* Help class
   */
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
    private modeAnswering            : boolean         = true;
    private questions                : Array<Question> = [];
    private teamsEvaluations         : Array<any>      = [];
    private teamsEvaluationsIdx      : number          = -1;
    private userInfo                 : User            = new User();
    private questionsImages          : Array<string>   = [];

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
            for(let u = 0 ; u < this.teamsEvaluations.length ; ++u) {
                if(this.userInfo.teamId == this.teamsEvaluations[u].id) {
                    this.teamsEvaluationsIdx = u;    
                }
            }
          }
        );
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
                this.questions.length  = nbrOfQuestions;
                for(let u = 0 ; u < nbrOfQuestions ; ++u) {
                    this.questions[u] = new Question();
                }
                this.teamsEvaluations.length = 0;
                console.log("observableQuestionsConfigure [" + nbrOfQuestions + "]")
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
                console.log("observableQuestionsActionx in");
                console.log(data);
                this.modeAnswering = data["answering"]; 
                console.log("observableQuestionsAction out");
            }
        );

        this.observableQuestionsEvaluations = this._websocketUserService
                                             .register("questions-evaluations")
        this.observableQuestionsEvaluationsSubscription = this.observableQuestionsEvaluations.subscribe(
            data => {
                console.log("observableQuestionsEvaluations check");
           	    if((null === data) || ("undefined" === typeof(data["evaluations"]))) {
                   //no info
                   return;
                }

                console.log("observableQuestionsEvaluations in");
                this.teamsEvaluations.length = 0;
                this.teamsEvaluationsIdx     = -1;
                for(let u = 0 ; u < data["evaluations"].length ; ++u) {
                    this.teamsEvaluations.push(data["evaluations"][u]);
                    if(this.userInfo.teamId == data["evaluations"][u].id) {
                        this.teamsEvaluationsIdx = u;    
                    }
                }
                console.log("observableQuestionsEvaluations out");
            }
        );

        this.observableQuestionsImagesOnClient = this._websocketUserService
                                             .register("questions-images-on-client")
        this.observableQuestionsImagesOnClientSubscription = this.observableQuestionsImagesOnClient.subscribe(
            data => {
                console.log("observableQuestionsImagesOnClient check");
                if((null == data) || ("undefined" === typeof(data["images"]))) {
                    //no info
                    console.log("observableQuestionsImagesOnClient check no info");
                    return;
                }
                //valid data

                console.log("observableQuestionsImagesOnClient in");
                this.questionsImages = data["images"];
                console.log(this.questionsImages);
                if(this.questionsImages.length !== this.questions.length) {
                    this.logService.error("observableQuestionsImagesOnClient size mismatch between questions (" + this.questions.length + ") and images (" + this.questionsImages.length + ").");
                    this.questionsImages.length = 0;
                }
                console.log("observableQuestionsImagesOnClient out");
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
    private userServiceSubscription                        : Subscription;
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
    private observableQuestionsImagesOnClient              : Observable<any>;
    private observableQuestionsImagesOnClientSubscription  : Subscription;
}
