import {Component}            from '@angular/core';
import {Observable}           from 'rxjs/Observable';
import {OnInit}               from '@angular/core';
import {OnDestroy}            from '@angular/core';
import {Subscription}         from 'rxjs/Subscription';

import {ComponentBase}        from './../../classes/component-base.class';

import {LogService }          from './../../services/log.service';
import {ModeService, EMode}   from './../../services/mode.service';
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
    private questions          : Question[] = [];
    private questionsNbrOk     : number     = 0;
    private questionsNbrTotal  : number     = 0;
    private questionsNbrShow   : boolean    = false;

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
                let nbrOfQuestions     = data["nbrOfQuestions"];
                this.questions.length  = 0;
                for(let u = 0 ; u < nbrOfQuestions ; ++u) {
                    this.questions.push(new Question());
                }
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

        this.observableQuestionsAnswerUpdateOne = this._websocketUserService
                                             .register("questions-answer-update-all")
        this.observableQuestionsAnswerUpdateOneSubscription = this.observableQuestionsAnswerUpdateOne.subscribe(
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
    }

    public ngOnDestroy() : void {
        this.observableQuestionsConfigureSubscription.unsubscribe();
        this.observableQuestionsAnswerUpdateOneSubscription.unsubscribe();
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
    private observableQuestionsConfigure                   : Observable<any>;
    private observableQuestionsConfigureSubscription       : Subscription;
    private observableQuestionsAnswerUpdateOne             : Observable<any>;
    private observableQuestionsAnswerUpdateOneSubscription : Subscription;
}
