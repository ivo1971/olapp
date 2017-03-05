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
    private questions          : string[]  = [];
    private questionsNbrOk     : number    = 0;
    private questionsNbrTotal  : number    = 0;
    private questionsNbrShow   : boolean   = false;

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
                let nbrOfQuestions     = data["nbrOfQuestions"];
                let nbrOfQuestionsList = this.questions.length;
                console.log("observableQuestionsConfigureSubscription [" + nbrOfQuestions + "]");
                if(nbrOfQuestionsList < nbrOfQuestions) {
                    console.log("observableQuestionsConfigureSubscription [" + nbrOfQuestions + "] add");
                    for(let u = 0 ; u < (nbrOfQuestions - nbrOfQuestionsList) ; ++u) {
                        this.questions.push("");
                    }
                } else if(nbrOfQuestionsList > nbrOfQuestions) {
                    console.log("observableQuestionsConfigureSubscription [" + nbrOfQuestions + "] remove");
                    this.questions.splice(nbrOfQuestions, nbrOfQuestionsList - nbrOfQuestions);
                }
            }
        );
    }

    public ngOnDestroy() : void {
        this.observableQuestionsConfigureSubscription.unsubscribe();
    }

    /* Event handlers called from the template
     */

    /* Private functions
     */

    /* Private members
     */
    private observableQuestionsConfigure               : Observable<any>;
    private observableQuestionsConfigureSubscription   : Subscription;
}
