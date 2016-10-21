import {Component}             from '@angular/core';
import {Observable}            from 'rxjs/Observable';
import {OnInit}                from '@angular/core';
import {Router}                from '@angular/router';

import {User}                  from './classes/user.class';

import {UserService}           from './services/user.service';
import {WebsocketUserService}  from './services/websocket.user.service';

@Component({
    moduleId   : module.id,
    selector   : 'test-app',
    templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
    private userNameValid      : boolean         = false;
    private websocketConnected : boolean         = false;
    private websocketAddress   : string          = "ws://192.168.0.69:8000/quiz";
    
    public constructor(
      private websocketService : WebsocketUserService,
      private userService      : UserService,
      private router           : Router
      ) {
    }

    public ngOnInit() {
        let user : Observable<User> = this.userService.getObservableUser();
        user.subscribe(
          value => {
            this.userNameValid = (0 !== value.name.length);
            this.websocketConnect();
          }
        );

        //register routing MI
        this.websocketService.register("route").subscribe(
          value => {
            var to : string = value.to;
            var toArray = [to];
            console.log("Route request to [" + to + "]");
            this.router.navigate(toArray);

            //todo: move to the routes
            let mode = {
              mode: to
            }
            this.websocketService.sendMsg("mode", mode);
          });
    }

    private websocketConnect() : void {
      //only connect once
      if(this.websocketConnected) {
        return;
      }

      //connect as soon as all information is available
      if((this.userNameValid) && (0 != this.websocketAddress.length)) {
        this.websocketService.connect(this.websocketAddress);
      }
    }
}

