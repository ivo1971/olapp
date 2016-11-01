import {Component}            from '@angular/core';

import {ComponentBase}        from './../../classes/component-base.class';

import {WebsocketUserService}  from './../../services/websocket.user.service';

@Component({
    moduleId   : module.id,
    selector   : 'test',
    templateUrl: 'test.component.html'
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
