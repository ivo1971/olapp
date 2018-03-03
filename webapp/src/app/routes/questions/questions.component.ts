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
    //set from the users-service observable
    public   userInfo             : User                     = new User();
    //members configured via the "questions-configure" message
    //(these array lengths should not be changed outside the
    // "questions-configure" handler)
    public   answeringType        : string                   = "";
    public   modeAnswering        : boolean                  = true; //can be changed via the "questions-action" message
                                                                     //true: answering mode; false: evaluation mode
    public   questions            : Array<Question>          = [];
    public   questionsImages      : Array<string>            = [];
    //members configured via the "questions-evaluations" message
    //(should only be used in the view when "modeAnswering" is false)
    //(reset via the "questions-configure" message)
    public   teamsEvaluations     : Array<any>               = []; //the team-evaluation info for all teams for all questions
    public   teamsEvaluationsIdx  : number                   = -1; //the index of this users team in teamsEvaluations
                                                                   //the view has to take into account that '-1' is a valid value,
                                                                   //in which case it should not access they array.
  
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
        //(used to know the team the user is in,
        // required to select the correct evaluation)
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
        //handle "questions-configure"
        //this is a reset, so start clean
        //and switch to answering mode
        this.observableQuestionsConfigure = this._websocketUserService
                                             .register("questions-configure")
        this.observableQuestionsConfigureSubscription = this.observableQuestionsConfigure.subscribe(
            data => {
                console.log("observableQuestionsConfigure in")
                let nbrOfQuestions           = data["nbrOfQuestions"];
                this.answeringType           = data["answeringType"];
                this.questions.length        = nbrOfQuestions;
                this.questionsImages.length  = nbrOfQuestions;
                for(let u = 0 ; u < nbrOfQuestions ; ++u) {
                    this.questions[u]        = new Question();
                    this.questionsImages[u]  = "";
                }
                this.teamsEvaluations.length = 0;
                console.log("observableQuestionsConfigure out [" + nbrOfQuestions + "]")
            }
        );

        //handle "questions-action"
        //switch between answering and evaluation mode
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

        //handle "questions-answer-update-one"
        //this message contains the answer for 1 question for this team
        //(used while another user in the same team is
        // answering a question, e.g. typing in the input
        // box)
        this.observableQuestionsAnswerUpdateOne = this._websocketUserService
                                             .register("questions-answer-update-one")
        this.observableQuestionsAnswerUpdateOneSubscription = this.observableQuestionsAnswerUpdateOne.subscribe(
            data => {
                console.log("observableQuestionsAnswerUpdateOne in")
                let idx    : number = data["idx"];
                let answer : string = data["answer"];
                if(this.questions.length <= idx) {
                    this.logService.error("questions-answer-update-one index [" + idx + "] too big (max: [" + this.questions.length + "])");
                    return;
                }
                this.questions[idx].answer = answer; 
                console.log("observableQuestionsAnswerUpdateOne out [" + idx + "][" + answer + "]")
            }
        );

        //handle "questions-answer-update-one"
        //this message contains the answers for all question for this team
        this.observableQuestionsAnswerUpdateAll = this._websocketUserService
                                             .register("questions-answer-update-all")
        this.observableQuestionsAnswerUpdateAllSubscription = this.observableQuestionsAnswerUpdateAll.subscribe(
            data => {
                console.log("observableQuestionsAnswerUpdateAll in")
                for(let u = 0 ; u < data["answers"].length ; ++u) {
                    let idx    : number = data["answers"][u]["idx"];
                    let answer : string = data["answers"][u]["answer"];
                    if(this.questions.length <= idx) {
                        //skip this answer
                        this.logService.error("questions-answer-update-all index [" + idx + "] too big (max: [" + this.questions.length + "])");
                        continue;
                    }
                    this.questions[idx].answer = answer; 
                }
                console.log(this.questions);
                console.log("observableQuestionsAnswerUpdateAll out")
            }
        );

        //handle "questions-evaluations"
        //this message contains evaluation information for all teams for all questions
        //it is expected while in evaluation mode
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
                        this.teamsEvaluationsIdx = u; //this ensures data consitency for the team-index    
                    }
                    //ensure the embedded arrays are large enough
                    for(let v = 0 ; v < this.questionsImages.length ; ++v) {
                        this.teamsEvaluations[u].evaluations.push(false);
                        this.teamsEvaluations[u].evaluationsDone.push(false);
                    }
                    
                }
                console.log("observableQuestionsEvaluations out");
            }
        );

        //handle "questions-images-on-client"
        //this message is expected in answering mode, it contains a list of images
        //coupled to questions
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
                let u : number = 0;
                for(/* continue where the initalisation started */ ; (u < this.questionsImages.length) && (u < data["images"].length) ; ++u) { //respect length of both input and output arrays
                    this.questionsImages[u] = data["images"][u];
                }
                for(/* continue where the previous loop stopped */ ; u < this.questionsImages.length ; ++u) {
                    this.questionsImages[u] = "";
                }
                console.log(this.questionsImages);
                console.log("observableQuestionsImagesOnClient out");
            }
        );
    }

    public ngOnDestroy() : void {
        this.observableQuestionsConfigureSubscription.unsubscribe();
        this.observableQuestionsActionSubscription.unsubscribe();
        this.observableQuestionsAnswerUpdateOneSubscription.unsubscribe();
        this.observableQuestionsAnswerUpdateAllSubscription.unsubscribe();
        this.observableQuestionsEvaluationsSubscription.unsubscribe();
        this.observableQuestionsImagesOnClientSubscription.unsubscribe();
    }

    /* Event handlers called from the template
     */
    //handler coupled to the good/wrong buttons,
    //converted into a value for the answer
    public onClickButtonAnswer(idx : number, answer: boolean) : void {
        console.log("onClickButtonAnswer [" + idx + "][" + answer + "]")
        this.valueChanged(idx, answer ? "good" : "bad");
    }

    //handler coupled to the input boxes
    public valueChanged(idx : number, answer: string) : void {
        console.log("valueChanged [" + idx + "][" + answer + "]")
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
    private observableQuestionsAction                      : Observable<any>;
    private observableQuestionsActionSubscription          : Subscription;
    private observableQuestionsAnswerUpdateOne             : Observable<any>;
    private observableQuestionsAnswerUpdateOneSubscription : Subscription;
    private observableQuestionsAnswerUpdateAll             : Observable<any>;
    private observableQuestionsAnswerUpdateAllSubscription : Subscription;
    private observableQuestionsEvaluations                 : Observable<any>;
    private observableQuestionsEvaluationsSubscription     : Subscription;
    private observableQuestionsImagesOnClient              : Observable<any>;
    private observableQuestionsImagesOnClientSubscription  : Subscription;
}
