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
    private cloudConnected             : number  = -1;
    private wsConnected                : boolean = true;
    private userName                   : string  = "";
    private teamName                   : string  = "";

    public constructor(
      private cloudService         : CloudService,
      private userService          : UserService,
      private websocketUserService : WebsocketUserService
      ) {
        this.wsConnectedSubscription = this.websocketUserService.getObservableConnected().subscribe(
          value => {
            this.wsConnected = value;
          });
        this.cloudConnectedSubscription = this.cloudService.getObservableConnected().subscribe(
          value => {
            this.cloudConnected = value;
          });
        this.userSubscription = this.userService.getObservableUser().subscribe(
          value => {
            this.userName = value.name;
            this.teamName = value.team;
          });
    }

    public ngOnDestroy() : void {
        this.userSubscription.unsubscribe();
        this.cloudConnectedSubscription.unsubscribe();
        this.wsConnectedSubscription.unsubscribe();
    }

    public toggleSideBar() : void {
      this.menuClosed = !this.menuClosed;
    }

    private cloudConnectedSubscription : Subscription;
    private wsConnectedSubscription    : Subscription;
    private userSubscription           : Subscription;
}
