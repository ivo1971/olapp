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
    public active : boolean = true;

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
            console.log(data);

            //compare this user's team to the teams in the list to
            //detect whether the buttone has been pushed or not
            if((data) && (data.teams)) {
                let pushed : boolean = false;
                let active : boolean = true;
                for(let u = 0 ; u < data.teams.length ; ++u) {
                    if(this.user.team === data.teams[u].name) {
                        pushed = true;
                        active = data.teams[u].active;
                        break;
                    }
                }
                this.pushed = pushed;
                this.active = active;
            } else {
                this.pushed = false;
                this.active = true;
            }

            //set the overall background based upn the button status
            let background : string = "info";
            if(this.pushed) {
                if(!this.active) {
                    background = "danger";
                } else {
                    background = "success";
                }
            }
            if(0 != this.bodyLastClass.length) {
                this.bodyElement.classList.remove(this.bodyLastClass);
            }
            this.bodyLastClass = "background-" + background;
            this.bodyElement.classList.add(this.bodyLastClass);
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
