import {Component}             from '@angular/core';
import {Observable}            from 'rxjs/Observable';

import {User}                  from './classes/user.class';

import {UserService }          from './services/user.service';
import {WebsocketUserService } from './services/websocket.user.service';

@Component({
    moduleId   : module.id,
    selector   : 'test-app',
    templateUrl: 'app.component.html',
})
export class AppComponent {
    private userNameValid      : boolean = false;
    private websocketConnected : boolean = false;
    private websocketAddress   : string  = "ws://192.168.0.69:8000/quiz";

    public constructor(
      private m_WebsocketService : WebsocketUserService,
      private userService : UserService
      ) {
        let user : Observable<User> = userService.getObservableUser();
        user.subscribe(
          value => {
            this.userNameValid = (0 !== value.name.length);
            this.websocketConnect();
          });
    }

    private websocketConnect() : void {
      //only connect once
      if(this.websocketConnected) {
        return;
      }

      //connect as soon as all information is available
      if((this.userNameValid) && (0 != this.websocketAddress.length)) {
        this.m_WebsocketService.connect(this.websocketAddress);
      }
    }
}

