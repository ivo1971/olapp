import {Component}            from '@angular/core';
import {Observable}           from 'rxjs/Observable';
import {OnInit}               from '@angular/core';
import {OnDestroy}            from '@angular/core';

import {ComponentBase}        from './../../classes/component-base.class';
import {SimpleButtonInfo}     from './../../classes/simple-button-info.class';
import {SimpleButtonTeamInfo} from './../../classes/simple-button-info.class';

import {WebsocketUserService} from './../../services/websocket.user.service';

@Component({
    moduleId   : module.id,
    selector   : 'simple-button',
    templateUrl: 'simple-button.component.html'
})
export class SimpleButtonComponent extends ComponentBase implements OnInit, OnDestroy { 
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

        //subscribe here too to change the background color of the body
        //element (apparently the only ways this can be done in Angular 2 is
        //unfortunately via JavaScript calls because the body element is
        //outside the root angular element)
        this.observableInfo.subscribe( data => {
            if(0 != this.bodyLastClass.length) {
                this.bodyElement.classList.remove(this.bodyLastClass);
            }
            this.bodyLastClass = "alert-" + data.background;
            this.bodyElement.classList.add(this.bodyLastClass);
        });
    }

    public ngOnDestroy() : void {
        //cleanup the body element
        this.bodyElement.classList.remove(this.bodyLastClass);
    }

    private observableInfo  : Observable<SimpleButtonInfo>;
    private bodyLastClass   : string                      = "";
    private bodyElement     : any                         = document.getElementsByTagName('body')[0];
}
