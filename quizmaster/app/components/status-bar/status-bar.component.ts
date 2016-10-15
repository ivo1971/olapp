import {Component }               from '@angular/core';
import {Observable}               from 'rxjs/Observable';

import {WebsocketMessageService}  from './../../services/websocket.message.service';

@Component({
  moduleId   : module.id,
  selector   : 'status-bar',
  templateUrl: 'status-bar.component.html'
})
export class StatusBarComponent { 
    private connected : boolean = true;

    public constructor(private websocketUserService : WebsocketMessageService) {
        let connected : Observable<boolean> = websocketUserService.getObservableConnected();
        connected.subscribe(
          value => {
            this.connected = value;
          });
    }
}
