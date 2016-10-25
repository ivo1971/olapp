import {Component}             from '@angular/core';
import {Observable}            from 'rxjs/Observable';
import {OnDestroy}            from '@angular/core';
import {Subscription}          from 'rxjs/Subscription';

import {User}                  from './../../classes/user.class';

import {WebsocketUserService } from './../../services/websocket.user.service';
import {UserService }          from './../../services/user.service';

@Component({
  moduleId   : module.id,
  selector   : 'status-bar',
  styleUrls  : [
      'status-bar.component.css',
  ],
  templateUrl: 'status-bar.component.html'
})
export class StatusBarComponent implements OnDestroy { 
    private menuClosed            : boolean = true;
    private connected             : boolean = true;
    private userName              : string  = "";

    private connectedObservable   : Observable<boolean>;
    private connectedSubscription : Subscription;
    private userObservable        : Observable<User>;
    private userSubscription      : Subscription;

    public constructor(
      private websocketUserService : WebsocketUserService,
      private userService : UserService
      ) {
        this.connectedObservable   = websocketUserService.getObservableConnected();
        this.connectedSubscription = this.connectedObservable.subscribe(
          value => {
            this.connected = value;
          });
        this.userObservable = userService.getObservableUser();
        this.userSubscription = this.userObservable.subscribe(
          value => {
            this.userName = value.name;
          });
    }

    public ngOnDestroy() : void {
        this.userSubscription.unsubscribe();
        this.connectedSubscription.unsubscribe();
    }

    public toggleSideBar() : void {
      this.menuClosed = !this.menuClosed;
    }
}
