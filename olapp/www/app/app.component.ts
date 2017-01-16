import {Component}             from '@angular/core';
import {Observable}            from 'rxjs/Observable';
import {OnInit}                from '@angular/core';
import {Router}                from '@angular/router';
import {Subscription}          from 'rxjs/Subscription';

import {LogService }           from './services/log.service';
import {ModeService, EMode}    from './services/mode.service';
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
    private isQuizMaster : boolean = false;
    public constructor(
      private router           : Router,
      private logService       : LogService,
      private modeService      : ModeService,
      private websocketService : WebsocketUserService
      ) {
          this.isQuizMaster = EMode.Master == this.modeService.GetMode();
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

    public onChangeMode(mode : string) : any {
        this.logService.log("select mode [" + mode + "]");
        this.websocketService.sendMsg("select-mode", {
            mode: mode
        });
    }
}

