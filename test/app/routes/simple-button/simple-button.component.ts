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
    templateUrl: 'simple-button.component.html'
})
export class SimpleButtonComponent extends ComponentBase implements OnInit, OnDestroy { 
    public pushed : boolean = false;
    public wrong  : boolean = false;
    public good   : boolean = false;

    public constructor(
      private _websocketService : WebsocketUserService,
      private userService : UserService
      ) {
          super(_websocketService);
    }

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
            //compare this user's team to the teams in the list to
            //detect whether the buttone has been pushed or not
            let active           : boolean = false;
            let firstActive      : boolean = false;
            let firstActiveFound : boolean = false;
            if((data) && (data.teams)) {
                let pushed : boolean = false;
                for(let u = 0 ; u < data.teams.length ; ++u) {
                    if(this.user.team === data.teams[u].name) {
                        pushed    = true;
                        active    = data.teams[u].active;
                        this.good = data.teams[u].good;
                        if(!firstActiveFound) {
                           firstActive = true; 
                        }
                        break;
                    }

                    if(data.teams[u].active) {
                        firstActiveFound = true;
                    }
                }
                this.pushed = pushed;
            } else {
                this.pushed = false;
                this.good   = false;
            }

            //set the overall background based upn the button status
            if(0 != this.bodyLastClass.length) {
                this.bodyElement.classList.remove(this.bodyLastClass);
            }
            if(data) {
                let background : string = "info"; //not pushed
                if(this.pushed) {
                    if(!active) {
                        background = "danger"; //pushed but no longer active
                        this.wrong = true;
                    } else if(firstActive) {
                        background = "success"; //pushed, active and first in the (active) list
                    } else {
                        background = "warning"; //pushed, active but not yet first in the (active) list
                    }
                } else {
                    this.wrong = false;
                }
                this.bodyLastClass = "background-" + background;
                this.bodyElement.classList.add(this.bodyLastClass);
            }
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

    private observableInfo             : Observable<SimpleButtonInfo>;
    private observableInfoSubscription : Subscription;
    private userSubscription           : Subscription;
    private bodyLastClass              : string                      = "";
    private bodyElement                : any                         = document.getElementsByTagName('body')[0];
    private user                       : User                        = new User();
}
