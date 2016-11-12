import {Component}             from '@angular/core';
import {Location}              from '@angular/common';

import {ComponentBase}         from './../../classes/component-base.class';

import {WebsocketUserService}  from './../../services/websocket.user.service';

@Component({
    moduleId   : module.id,
    selector   : 'about',
    styleUrls  : [
        'about.component.css'
    ],
    templateUrl: 'about.component.html'
})
export class AboutComponent extends ComponentBase { 
    public constructor(
        private _websocketUserService : WebsocketUserService,
        private location              : Location
        ) { 
        super(_websocketUserService);
    }

    public onBack() {
      this.location.back();
  }
}
