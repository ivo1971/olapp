import {Component}             from '@angular/core';
import {Observable}            from 'rxjs/Observable';
import {OnInit}                from '@angular/core';
import {Router}                from '@angular/router';
import {Subscription}          from 'rxjs/Subscription';

import {WebsocketUserService}  from './services/websocket.user.service';

import template                from "./app.component.html";
//import style                   from "./app.component.scss";

@Component({
  selector: "app",
  template,
  //styles: [ style ]
})
export class AppComponent implements OnInit {
    public constructor(
      private router           : Router,
      private websocketService : WebsocketUserService
      ) {
    }

    public ngOnInit() {
        //register routing MI
        this.websocketService.register("route").subscribe(
          value => {
            var to : string = "/quiz/" + value.to;
            var toArray = [to];
            console.log("Route request to [" + to + "]");
            this.router.navigate(toArray);
          });
    }
}
