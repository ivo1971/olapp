import {Component}            from '@angular/core';

import {ComponentBase}        from './../../classes/component-base.class';

import {WebsocketUserService}  from './../../services/websocket.user.service';

import template                from "./test.component.html";
//import style                 from "./test.component.scss";

@Component({
  selector: "test",
  template,
  //styles: [ style ]
})
export class TestComponent extends ComponentBase { 
    /* Private variables intended for the template
     * (hence at the top)
     */

    /* Construction
     */
    public constructor(
      private _websocketService : WebsocketUserService,
      ) {
          super(_websocketService);
    }
}
