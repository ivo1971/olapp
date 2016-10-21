import {Component}             from '@angular/core';
import {Observable}            from 'rxjs/Observable';

import {User}                  from './../../classes/user.class';

import {WebsocketUserService } from './../../services/websocket.user.service';
import {UserService }          from './../../services/user.service';

@Component({
  moduleId   : module.id,
  selector   : 'status-bar',
  templateUrl: 'status-bar.component.html'
})
export class StatusBarComponent { 
    private connected : boolean = true;
    private userName  : string  = "";

    public constructor(
      private websocketUserService : WebsocketUserService,
      private userService : UserService
      ) {
        let connected : Observable<boolean> = websocketUserService.getObservableConnected();
        connected.subscribe(
          value => {
            this.connected = value;
          });
        let user : Observable<User> = userService.getObservableUser();
        user.subscribe(
          value => {
            this.userName = value.name;
          });
    }
}
