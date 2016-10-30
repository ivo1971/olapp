import {Component}            from '@angular/core';
import {Observable}           from 'rxjs/Observable';
import {OnInit}               from '@angular/core';
import {OnDestroy}            from '@angular/core';
import {Subscription}         from 'rxjs/Subscription';

import {ComponentBase}        from './../../classes/component-base.class';
import {SimpleButtonInfo}     from './../../classes/simple-button-info.class';
import {SimpleButtonTeamInfo} from './../../classes/simple-button-info.class';

import {User}                  from './../../classes/user.class';

import {UserService }          from './../../services/user.service';
import {WebsocketUserService}  from './../../services/websocket.user.service';

@Component({
    moduleId   : module.id,
    selector   : 'simple-button',
    styleUrls  : [
        'simple-button.component.css'
    ],
    templateUrl: 'simple-button.component.html'
})
export class SimpleButtonComponent extends ComponentBase implements OnInit, OnDestroy { 
    /* Private variables intended for the template
     * (hence at the top)
     */
    private prevSequenceNbr : number  = 0;
    private pushed          : boolean = false;
    private wrong           : boolean = false;
    private good            : boolean = false;

    /* Construction
     */
    public constructor(
      private _websocketService : WebsocketUserService,
      private userService : UserService
      ) {
          super(_websocketService);
    }

    /* Life-cycle hooks
     */
    public ngOnInit() : void {
        //inform parent
        this.sendLocation("simple-button");

        //register routing MI
        this.observableInfo = this._websocketService.register("simple-button");

        //get user info
        this.userSubscription = this.userService.getObservableUser().subscribe(
          user => {
            this.user = user;
          });

        //subscribe here too to change the background color of the body
        //element (apparently the only ways this can be done in Angular 2 is
        //unfortunately via JavaScript calls because the body element is
        //outside the root angular element)
        this.observableInfoSubscription = this.observableInfo.subscribe(data => {
            this.handleSimpleButton(data);
        });
    }

    public ngOnDestroy() {
        //cleanup the body element
        if(0 != this.bodyLastClass.length) {
            this.bodyElement.classList.remove(this.bodyLastClass);
        }

        //unsubscribe
        this.observableInfoSubscription.unsubscribe();
        this.userSubscription.unsubscribe();
    }

    /* Private functions
     */
    //this funciont evaluates 1 incoming simple-button message.
    //It should completely evaluate the message and act on it,
    //without any history. Except for the sequence number wich
    //is required to catch potential races in the send mechanism
    //on the server.
    //Handling without history is important in case the device
    //loses connection a short time.
    private handleSimpleButton(data : SimpleButtonInfo) : void {
        //check if data is available
        if(!data) {
            console.error("Simple button sinking message without data");            
            return;
        }

        //check and handle sequence number
        let sequenceNbr = data.seqNbr;
        if(0 == sequenceNbr) {
            console.warn("Simple-button reset");
            this.prevSequenceNbr = 0;
            this.reset(null);
            return;
        } else if(this.prevSequenceNbr > sequenceNbr) {
            console.warn("Simple-button sinking out-of-order [" + this.prevSequenceNbr + "] > [" + sequenceNbr + "]");
            return;                
        }
        this.prevSequenceNbr = sequenceNbr;
        console.log("Simple-button handling message [" + sequenceNbr + "]");

        //check the teams info.
        //when there are no teams: reset 
        //(except the sequence number)
        if(!data.teams) {
            console.log("Simple-button handling message [" + sequenceNbr + "]: no teams on the list");
            this.reset("info");
            return;
        }

        //compare this user's team to the teams in the list to
        //calculate the current state and act on it
        {
            let userOnList       : boolean = false;
            let firstActiveFound : boolean = false;
            for(let u = 0 ; u < data.teams.length ; ++u) {
                if(this.user.team === data.teams[u].name) {
                    //team is on the list, so the button has been
                    //pushed
                    userOnList  = true;
                    this.pushed = true;

                    //check if the team is still active,
                    //if it is not: the team timed out or
                    //answered wrong
                    this.wrong = !data.teams[u].active;

                    //check if the team has the 'good' flag
                    this.good = data.teams[u].good;

                    //set the background based upon the current state
                    console.log("Simple-button handling message [" + sequenceNbr + "]: team found on the list (good: [" + this.good + "])(wrong: ["+ this.wrong +"])(first: [" + !firstActiveFound + "])");
                    if(this.wrong) {
                        this.backgroundSet("danger");
                    } else if(this.good) {
                        this.backgroundSet("success");
                    } else if(!firstActiveFound) {
                        //this team is the first on the list                        
                        this.backgroundSet("success");
                    } else {
                        //team has pushed, but other teams
                        //are preceding it on the list
                        this.backgroundSet("warning");                        
                    }

                    //quit the loop as early as possible
                    break;
                }

                //look for the first active team on the list
                //as this has influence on this team's background
                if(data.teams[u].active) {
                    console.log("Simple-button handling message [" + sequenceNbr + "]: other prior team(s) found on the list");
                    firstActiveFound = true;
                }
            }
            if(!userOnList) {
                this.reset("info");
            }
        }
    }

    private reset(background : string) : void {
        console.log("reset");
        this.pushed = false;
        this.wrong  = false;
        this.good   = false;
        this.backgroundSet(background);
    }

    private backgroundClear() : void {
        console.log("backgroundClear");
        if(0 != this.bodyLastClass.length) {
            this.bodyElement.classList.remove(this.bodyLastClass);
            this.bodyLastClass = "";
        }
    }

    private backgroundSet(background : string) : void {
        //handle null
        console.log("backgroundSet [" + background + "]");
        if(!background) {
            this.backgroundClear();
            return;
        }

        //detect changes to avoid needlesly changing the DOM
        let newClass : string = "background-" + background;
        if(newClass == this.bodyLastClass) {
            console.log("backgroundSet [" + background + "] --> no change");
            return;
        }
        console.log("backgroundSet [" + this.bodyLastClass + "] --> [" + newClass + "]");

        //update the DOM
        this.backgroundClear();
        this.bodyLastClass = newClass;
        this.bodyElement.classList.add(this.bodyLastClass);
    }

    /* Private members
     */
    private observableInfo             : Observable<SimpleButtonInfo>;
    private observableInfoSubscription : Subscription;
    private userSubscription           : Subscription;
    private bodyLastClass              : string                      = "";
    private bodyElement                : any                         = document.getElementsByTagName('body')[0];
    private user                       : User                        = new User();
}
