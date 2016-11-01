import {Component}             from '@angular/core';
import {Observable}            from 'rxjs/Observable';
import {OnDestroy}             from '@angular/core';
import {Subscription}          from 'rxjs/Subscription';

import {User}                  from './../../classes/user.class';

import {CloudService }         from './../../services/cloud.service';
import {UserService }          from './../../services/user.service';
import {WebsocketUserService } from './../../services/websocket.user.service';

@Component({
  moduleId   : module.id,
  selector   : 'status-bar',
  styleUrls  : [
      'status-bar.component.css',
  ],
  templateUrl: 'status-bar.component.html'
})
export class StatusBarComponent implements OnDestroy { 
    private menuClosed                 : boolean = true;
    private cloudConnected             : boolean = true;
    private wsConnected                : boolean = true;
    private userName                   : string  = "";
    private teamName                   : string  = "";

    private cloudConnectedObservable   : Observable<boolean>;
    private cloudConnectedSubscription : Subscription;
    private wsConnectedObservable      : Observable<boolean>;
    private wsConnectedSubscription    : Subscription;
    private userObservable             : Observable<User>;
    private userSubscription           : Subscription;

    public constructor(
      private cloudService         : CloudService,
      private userService          : UserService,
      private websocketUserService : WebsocketUserService
      ) {
        this.wsConnectedObservable   = websocketUserService.getObservableConnected();
        this.wsConnectedSubscription = this.wsConnectedObservable.subscribe(
          value => {
            this.wsConnected = value;
          });
        this.cloudConnectedObservable   = websocketUserService.getObservableConnected();
        this.cloudConnectedSubscription = this.cloudConnectedObservable.subscribe(
          value => {
            this.cloudConnected = value;
          });
        this.userObservable = userService.getObservableUser();
        this.userSubscription = this.userObservable.subscribe(
          value => {
            this.userName = value.name;
            this.teamName = value.team;
          });
    }

    public ngOnDestroy() : void {
        this.userSubscription.unsubscribe();
        this.wsConnectedSubscription.unsubscribe();
    }

    public toggleSideBar() : void {
      this.menuClosed = !this.menuClosed;
    }
}
