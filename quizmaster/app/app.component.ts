import {Component}               from '@angular/core';

import {WebsocketMessageService} from './services/websocket.message.service';

@Component({
  moduleId   : module.id,
  selector   : 'quizmaster',
  templateUrl: 'app.component.html'
})
export class AppComponent { 
    public constructor(private websocketService : WebsocketMessageService) {
        this.websocketService.connect("ws://192.168.0.69:8000/quizMaster");
    };

    public routeTo(to: string) : void {
        let route = {
            to: to,
        }
        this.websocketService.sendMsg("route", route);
    }
}
