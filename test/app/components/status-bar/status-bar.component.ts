import {Component }           from '@angular/core';
import {Observable}           from 'rxjs/Observable';

import {WebsocketUserService } from './../../services/websocket.user.service';

@Component({
  moduleId   : module.id,
  selector   : 'status-bar',
  templateUrl: 'status-bar.component.html'
})
export class StatusBarComponent { 
    private connected : boolean = true;

    public constructor(private websocketUserService : WebsocketUserService) {
        let connected : Observable<boolean> = websocketUserService.getObservableConnected();
        connected.subscribe(
          value => {
            this.connected = value;
          });
    }
}
