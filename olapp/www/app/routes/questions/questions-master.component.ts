import {Component}            from '@angular/core';
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
    private numberOfQuestions  : number  = 10;
    private pointsPerQuestion  : number  = 1;
    private resetConfirm       : boolean = false;
    private modeAnswering      : boolean = true;

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
        this.modeAnswering = true;
    }

    private onClickRadioAction(answering : boolean) : void {
        console.log("onClickRadioAction: [" + answering + "]");
        this.modeAnswering = answering;
        this._websocketUserService.sendMsg("questions-action", {
            answering: answering
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
