import {Component}               from '@angular/core';
import {OnInit}                  from '@angular/core';
import {Observable}              from 'rxjs/Observable';

import {WebsocketMessageService} from './../../services/websocket.message.service';

@Component({
  moduleId   : module.id,
  selector   : 'users',
  templateUrl: 'users.component.html'
})
export class UsersComponent implements OnInit {
    private websocketDataIn : Observable<any>;
    private users           : any[] = [];

    public constructor(private websocketService: WebsocketMessageService) { 
    }
    public ngOnInit() {
        let _this = this;
        this.websocketService.getObservable().subscribe(
            function(result: any) {
                console.log("Next");                
                //TODO: check MI before using data
                _this.users.length = 0;
                for (var i = 0; i < result.data.length; i++) {
                    _this.users.push(result.data[i]);
                }
            },
            function(err: any) {
                console.log("Error result");                
            },
            function() {
                console.log("Completed");
            }
        );
        this.websocketDataIn = this.websocketService.getObservable();

        //send initial request to get all users
        this.websocketService.sendMsg("getUsers", null);
    }
}