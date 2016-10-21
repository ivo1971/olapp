import {Component}               from '@angular/core';
import {OnInit}                  from '@angular/core';

import {ModeSelectorBase}        from './../../classes/mode-selector-base'; 

import {WebsocketMessageService} from './../../services/websocket.message.service';

@Component({
  moduleId   : module.id,
  selector   : 'test-button',
  templateUrl: 'test-button.component.html'
})
export class TestButtonComponent extends ModeSelectorBase implements OnInit {
  public constructor(private _websocketMessageService : WebsocketMessageService) {
    super(_websocketMessageService);
  }

  public ngOnInit() : void {
    this.init("test-button");
  }
}
