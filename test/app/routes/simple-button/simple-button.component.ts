import {Component}            from '@angular/core';
import {Observable}           from 'rxjs/Observable';
import {OnInit}               from '@angular/core';

import {ComponentBase}        from './../../classes/component-base.class';
import {SimpleButtonInfo}     from './../../classes/simple-button-info.class';
import {SimpleButtonTeamInfo} from './../../classes/simple-button-info.class';

import {WebsocketUserService} from './../../services/websocket.user.service';

@Component({
    moduleId   : module.id,
    selector   : 'simple-button',
    templateUrl: 'simple-button.component.html'
})
export class SimpleButtonComponent extends ComponentBase implements OnInit { 
    public constructor(
      private _websocketService : WebsocketUserService
      ) {
          super(_websocketService);
    }

    public ngOnInit() : void {
        //inform parent
        this.sendLocation("simple-button");

        //register routing MI
        this.observableInfo = this._websocketService.register("simple-button");
    }

    private observableInfo  : Observable<SimpleButtonInfo>;
}
