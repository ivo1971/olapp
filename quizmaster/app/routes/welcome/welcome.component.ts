import {Component}               from '@angular/core';
import {OnInit}                  from '@angular/core';

import {ModeSelectorBase}        from './../../classes/mode-selector-base'; 

import {WebsocketMessageService} from './../../services/websocket.message.service';

@Component({
  moduleId   : module.id,
  selector   : 'welcome',
  templateUrl: 'welcome.component.html'
})
export class WelcomeComponent extends ModeSelectorBase implements OnInit {
  public constructor(private _websocketMessageService : WebsocketMessageService) {
    super(_websocketMessageService);
  }

  public ngOnInit() : void {
    this.init("welcome");
  }
}
