import {Component}            from '@angular/core';
import {IntervalObservable}   from 'rxjs/observable/IntervalObservable';
import {Observable}           from 'rxjs/Observable';
import {OnInit}               from '@angular/core';
import {OnDestroy}            from '@angular/core';
import {Subscription}         from 'rxjs/Subscription';

import {ComponentBase}        from './../../classes/component-base.class';

import {LogService }          from './../../services/log.service';
import {ModeService, EMode}   from './../../services/mode.service';
import {WebsocketUserService} from './../../services/websocket.user.service';

import {QuestionsSelectImage} from './questions.classes';

class TeamQuestionsEvaluation {
    public id           : string = "";
    public name         : string = "";
    public nbrCorrect   : number = 0;
    public nbrEvaluated : number = 0;
    public pointsRound  : number = 0;
}

class AnsweringType {
    public constructor(public name : string) {
    }
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
    private answeringTypeOptions    : Array<AnsweringType>           = [
        new AnsweringType("Input"),
        new AnsweringType("Good-Wrong")
    ];
    private answeringType           : string                         = this.answeringTypeOptions[0].name; 
    private resetConfirm            : boolean                        = false;
    private modeAnswering           : boolean                        = true;
    private teamQuestionsEvaluation : Array<TeamQuestionsEvaluation> = [];
    private imagesAvailable         : Object                         = new Object();
    private imagesAvailableSet      : boolean                        = false;
    private imagesDisplay           : Array<string>                  = [];

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
                this.answeringType     = data["answeringType"];
                console.log("observableQuestionsConfigure-master [" + this.numberOfQuestions + "][" + this.pointsPerQuestion + "][" + this.answeringType + "]");
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

        this.observableQuestionsImagesOnClientMaster = this._websocketUserService
                                             .register("questions-images-on-client-master")
        this.observableQuestionsImagesOnClientMasterSubscription = this.observableQuestionsImagesOnClientMaster.subscribe(
            data => {
                console.log("observableQuestionsImagesOnClientMaster check");
                if((null == data) || ("undefined" === typeof(data["images"]))) {
                    //no info
                    console.log("observableQuestionsImagesOnClientMaster check no info");
                    return;
                }
                //valid data

                console.log("observableQuestionsImagesOnClientMaster in");
                this.imagesDisplay = data["images"];
                console.log(this.imagesDisplay);
                if(this.imagesDisplay.length !== this.numberOfQuestions) {
                    this.logService.error("observableQuestionsImagesOnClientMaster size mismatch between questions (" + this.imagesDisplay.length + ") and images (" + this.numberOfQuestions + ").");
                    this.imagesDisplay.length = this.numberOfQuestions;
                    for(let u : number = 0 ; u < this.imagesDisplay.length ; ++u) {
                        this.imagesDisplay[u] = "";
                    }
                }
                console.log("observableQuestionsImagesOnClientMaster out");
            }
        );

        this.observableQuestionsImagesAvailable = this._websocketUserService
                                             .register("questions-images-available")
        this.observableQuestionsImagesAvailableSubscription = this.observableQuestionsImagesAvailable.subscribe(
            data => {
                console.log("observableQuestionsImagesAvailable in");
                this.imagesAvailable    = data;
                this.imagesAvailableSet = true;
                console.log(this.imagesAvailable);
                console.log("observableQuestionsImagesAvailable out");
            }
        );
    }

    public ngOnDestroy() : void {
        this.observableQuestionsConfigureSubscription.unsubscribe();
        this.observableQuestionsActionSubscription.unsubscribe();
        this.observableQuestionsImagesOnClientMasterSubscription.unsubscribe();
        this.observableQuestionsImagesAvailableSubscription.unsubscribe();
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
        let data = {
            nbrOfQuestions:    this.numberOfQuestions,
            pointsPerQuestion: this.pointsPerQuestion,
            answeringType:     this.answeringType
        };
        console.log(data);
        this._websocketUserService.sendMsg("questions-configure", data);    
        this.onClickRadioAction(true);
        this.modeAnswering                  = true;
        this.teamQuestionsEvaluation.length = 0;
        this.imagesDisplay.length           = this.numberOfQuestions;
        for(let u : number = 0 ; u < this.imagesDisplay.length ; ++u) {
            this.imagesDisplay[u] = "";
        }
    }

    private onClickRadioAction(answering : boolean) : void {
        console.log("onClickRadioAction: [" + answering + "]");
        this.modeAnswering             = answering;

        //send a first time
        this._websocketUserService.sendMsg("questions-action", {
            answering: answering
        });        

        //send a second time to get late-answers
        if(!this.modeAnswering) {
            let timer : Observable<number> = IntervalObservable.create(2000);
            let timerSubscription = timer.subscribe(t => {
                timerSubscription.unsubscribe();
                if(!this.modeAnswering) { //double check
                    console.log("onClickRadioAction: request answers a 2nd time");
                    this._websocketUserService.sendMsg("questions-action", {
                        answering: answering
                    });        
                }
            });
        }
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

    private onImagesAvailableClick(image : QuestionsSelectImage) : void {
        console.log("onImagesAvailableClick [" + image.question + "][" + image.url + "]");
        console.log(image);
        this._websocketUserService.sendMsg("questions-image-on-beamer", {
            image : image
        });
        this.imagesDisplay[image.question] = image.url;
        console.log(this.imagesDisplay);
        this._websocketUserService.sendMsg("questions-images-on-client", {
            images : this.imagesDisplay
        });
    }

    /* Private functions
     */

    /* Private members
     */
    private observableQuestionsConfigure                        : Observable<any>;
    private observableQuestionsConfigureSubscription            : Subscription;
    private observableQuestionsAction                           : Observable<any>;
    private observableQuestionsActionSubscription               : Subscription;
    private observableQuestionsImagesOnClientMaster             : Observable<any>;
    private observableQuestionsImagesOnClientMasterSubscription : Subscription;
    private observableQuestionsImagesAvailable                  : Observable<any>;
    private observableQuestionsImagesAvailableSubscription      : Subscription;
}
