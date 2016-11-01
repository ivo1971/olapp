import {Component}             from '@angular/core';
import {Observable}            from 'rxjs/Observable';
import {OnInit}                from '@angular/core';
import {Router}                from '@angular/router';
import {Subscription}          from 'rxjs/Subscription';

import {CloudService}          from './services/cloud.service';
import {WebsocketUserService}  from './services/websocket.user.service';

@Component({
    moduleId   : module.id,
    selector   : 'test-app',
    styleUrls  : [
        'app.component.css',
    ],
    templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
    public constructor(
      private cloudService     : CloudService,
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

