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

import {QuestionsSelectImage} from './questions.classes';

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
    //set one time as an html element attribute, not expected to change after instantiation
    @Input()  inMaster             : boolean                  = false; 
    //in master-mode: send evaluation info to the parent element
    @Output() teamEvaluationsEvt   : EventEmitter<Array<any>> = new EventEmitter<Array<any>>();
    //members configured via the "questions-configure" message
    private   answeringType        : string                   = "";
    private   modeAnswering        : boolean                  = true; //can be changed via the "questions-action" message
                                                                      //true: answering mode; false: evaluation mode
    //members configured via the "questions-teams-answers-all" message
    //(should only be used in the view when "modeAnswering" is false)
    //(reset via the "questions-configure" message)
    private   arraysInitDone       : boolean                  = false;
    private   teamsAnswers         : Array<any>               = [];   //length: number of teams
    private   teamsEvaluations     : Array<any>               = [];   //length: number of teams
    private   dummies              : Array<string>            = [];   //length: number of answers
    private   questionsImages      : Array<string>            = [];   //length: number of answers
    //members updated via the "questions-image-on-beamer" message
    //(reset via the "questions-configure" message)
    private   questionsSelectImage : QuestionsSelectImage     = new QuestionsSelectImage();

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
        
        //handle "questions-configure"
        //this is a reset, so start clean
        //and switch to answering mode
        this.observableQuestionsConfigure = this._websocketUserService
                                             .register("questions-configure")
        this.observableQuestionsConfigureSubscription = this.observableQuestionsConfigure.subscribe(
            data => {
                console.log("observableQuestionsConfigure in");
                let nbrOfQuestions           = data["nbrOfQuestions"];
                this.answeringType           = data["answeringType"];
                this.modeAnswering           = true;
                this.arraysInitDone          = false;
                this.dummies.length          = 0;
                this.teamsAnswers.length     = 0;
                this.teamsEvaluations.length = 0;     
                this.questionsImages.length  = 0;
                this.questionsSelectImage    = new QuestionsSelectImage();
                console.log("observableQuestionsConfigure out");
            }
        );

        //handle "questions-action"
        //switch between answering and evaluation mode
        this.observableQuestionsAction = this._websocketUserService
                                             .register("questions-action")
        this.observableQuestionsActionSubscription = this.observableQuestionsAction.subscribe(
            data => {
                this.modeAnswering = data["answering"]; 
                console.log("observableQuestionsAction [" + this.modeAnswering + "]");
            }
        );

        //handle "questions-teams-answers-all"
        //this message contains information about all the answers given by all the teams
        //this message is expected when switching from answering to evaluation mode
        //but it can be received multiple times without intermediate resets
        //this should be the only location where array sizes are changed, so they will
        //always be consistent with one another
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

                let nbrTeams : number = data["teams"].length;
                console.log("observableQuestionsTeamsAnswersAll in [" + nbrTeams + "]");
                this.teamsAnswers.length     = nbrTeams;
                this.teamsEvaluations.length = nbrTeams;
                for(let u = 0 ; u < data["teams"].length ; ++u) {
                    //one-time configurations
                    //(team independent, array length is number of answers)
                    let nbrAnswers : number      = data["teams"][u]["answers"].length;
                    if((!this.arraysInitDone) && (0 === u)) {
                        this.dummies.length          = nbrAnswers;
                        this.questionsImages.length  = nbrAnswers;
                        for(let v : number = 0 ; v < nbrAnswers ; ++v) {
                            this.dummies[v]         = v.toString();
                            this.questionsImages[v] = "";
                        }
                    }

                    //per team initialisations: copy from incoming data
                    this.teamsAnswers[u] = data["teams"][u];

                    //per team initialisations: prepare data structure
                    if(!this.arraysInitDone) {
                        let evaluation : any = {
                            id:              data["teams"][u].id,
                            name:            data["teams"][u].name,
                            nbrCorrect:      0,
                            nbrEvaluated:    0,
                            evaluations:     new Array<boolean>(),
                            evaluationsDone: new Array<boolean>()
                        }
                        for(let v = 0 ; v < nbrAnswers ; ++v) {
                            evaluation.evaluations.push(false);
                            evaluation.evaluationsDone.push(false);
                        }
                        this.teamsEvaluations[u] = evaluation;
                    }
                }
                console.log(this.dummies);
                console.log(this.questionsImages);
                console.log(this.teamsAnswers);
                console.log(this.teamsEvaluations);
                this.arraysInitDone = true;
                console.log("observableQuestionsTeamsAnswersAll out");
            }
        );

        //handle "questions-evaluations"
        //this message contains evaluation information for all teams for all questions
        //it is expected while in evaluation mode
        //this handler should NOT change array sizes
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
                //valid data

                console.log("observableQuestionsEvaluations in");
                for(let u = 0 ; (u < this.teamsEvaluations.length) && (u < data["evaluations"].length) ; ++u) { //respect length of both input and output arrays
                    this.teamsEvaluations[u] = data["evaluations"][u];
                }

                //spread the news to the parent element (@Output)
                this.teamEvaluationsEvt.next(this.teamsEvaluations);
                console.log("observableQuestionsEvaluations out");
            }
        );

        //handle "questions-image-on-beamer"
        //this message contains information about the current question and the accompanying
        //image that has to be shown in answering mode
        //this handler should NOT change array sizes
        this.observableQuestionsImageOnBeamer = this._websocketUserService
                                             .register("questions-image-on-beamer")
        this.observableQuestionsImageOnBeamerSubscription = this.observableQuestionsImageOnBeamer.subscribe(
            data => {
                console.log("observableQuestionsImageOnBeamer check");
                if((null == data) || ("undefined" === typeof(data["image"]))) {
                    //no info
                    console.log("observableQuestionsImageOnBeamer check no info");
                    return;
                }
                //valid data

                console.log("observableQuestionsImageOnBeamer in");
                this.questionsSelectImage = data["image"];
                console.log(this.questionsSelectImage);
                console.log("observableQuestionsImageOnBeamer out");
            }
        );

        //handle "questions-images-on-client"
        //this message is expected in answering mode, it contains a list of images
        //coupled to questions
        //this list is shown in evaluating mode
        //this handler should NOT change array sizes
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
                for(let u = 0 ; (u < this.questionsImages.length) && (u < data["images"].length) ; ++u) { //respect length of both input and output arrays
                    this.questionsImages[u] = data["images"][u];
                }
                console.log(this.questionsImages);
                console.log("observableQuestionsImagesOnClient out");
            }
        );
    }

    public ngOnDestroy() : void {
        this.observableQuestionsActionSubscription.unsubscribe();
        this.observableQuestionsConfigureSubscription.unsubscribe();
        this.observableQuestionsActionSubscription.unsubscribe();
        this.observableQuestionsTeamsAnswersAllSubscription.unsubscribe();
        this.observableQuestionsEvaluationsSubscription.unsubscribe();
        this.observableQuestionsImageOnBeamerSubscription.unsubscribe();
        this.observableQuestionsImagesOnClientSubscription.unsubscribe();
    }

    /* Event handlers called from the template
     */

    /* Private functions
     */
    //in master mode: one answer (one team) on one question is evaluated
    private onClickCheckboxEvaluate(teamIdx : number, answerIdx : number, checked: boolean) : void {
        this.logService.log("onClickCheckboxEvaluate [" + teamIdx + "][" + answerIdx + "][" + checked + "]");
        this.teamsEvaluations[teamIdx].evaluations[answerIdx] = checked;
    }

    //in master mode: one question has been evaluated for all teams,
    //                the results can now be taken into accound
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

        //spread the news: send to the server
        this._websocketUserService.sendMsg("questions-evaluations", {
            evaluations: this.teamsEvaluations
        });    
        //spread the news: send to the parent element
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
    private observableQuestionsImageOnBeamer               : Observable<any>;
    private observableQuestionsImageOnBeamerSubscription   : Subscription;
    private observableQuestionsImagesOnClient              : Observable<any>;
    private observableQuestionsImagesOnClientSubscription  : Subscription;
}