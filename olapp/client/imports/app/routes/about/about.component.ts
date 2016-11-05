import {Component}             from '@angular/core';
import {Location}              from '@angular/common';

import {ComponentBase}         from './../../classes/component-base.class';

import {WebsocketUserService}  from './../../services/websocket.user.service';

import template                from "./about.component.html";
//import style                   from "./about.component.scss";

@Component({
  selector: "about",
  template,
  //styles: [ style ]
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
