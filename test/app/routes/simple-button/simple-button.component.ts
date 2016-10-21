import {Component}            from '@angular/core';
import {Observable}           from 'rxjs/Observable';

import {WebsocketUserService} from './../../services/websocket.user.service';

@Component({
    moduleId   : module.id,
    selector   : 'simple-button',
    templateUrl: 'simple-button.component.html'
})
export class SimpleButtonComponent { 
    public constructor(
      private m_WebsocketService : WebsocketUserService
      ) {
    }

    public push() : void {
        
    }
}
