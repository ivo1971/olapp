import {Component}            from '@angular/core';
import {Observable}           from 'rxjs/Observable';
import {OnInit}               from '@angular/core';
import {OnDestroy}            from '@angular/core';
import {Subscription}         from 'rxjs/Subscription';

import {User}                 from './../../classes/user.class';
import {ComponentBase}        from './../../classes/component-base.class';

import {UserService}          from './../../services/user.service';
import {WebsocketUserService} from './../../services/websocket.user.service';

import template                from "./welcome.component.html";
//import style                 from "./welcome.component.scss";

@Component({
  selector: "welcome``",
  template,
  //styles: [ style ]
})
export class WelcomeComponent extends ComponentBase implements OnInit, OnDestroy { 
    private userName         : string = "";
    private userObservable   : Observable<User>;
    private userSubscription : Subscription;
    
    public constructor(
        private _websocketUserService : WebsocketUserService,
        private userService           : UserService
        ) { 
        super(_websocketUserService);
    }

    public ngOnInit() : void {
        this.userObservable   = this.userService.getObservableUser();
        this.userSubscription = this.userObservable.subscribe(
            value => {
                this.userName = value.name;
            });
        this.sendLocation("welcome");
    }

    public ngOnDestroy() : void {
        this.userSubscription.unsubscribe();
    }
}
