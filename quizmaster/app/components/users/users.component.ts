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
        this.websocketService.getObservable().subscribe(
            result => {
                console.log(result);
                //this.users = result.data;
            }, 
            error => {
                console.log("Error result");
            }
        );
        this.websocketDataIn = this.websocketService.getObservable();

        //send initial request to get all users
        this.websocketService.sendMsg("getUsers", null);
    }
}