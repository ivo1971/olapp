import {BehaviorSubject}      from 'rxjs/BehaviorSubject';
import {Component}            from '@angular/core';
import {Input}                from '@angular/core';
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
        this.sendLocation("simple-button");
    }

    public push() : void {
        this._count++;
        let simpleButtonTeamInfo : SimpleButtonTeamInfo = new SimpleButtonTeamInfo();
        simpleButtonTeamInfo.name       = "name [" + this._count + "]";
        simpleButtonTeamInfo.background = "red";
        this._info.teams.push(simpleButtonTeamInfo); 
        this._info.background = simpleButtonTeamInfo.name;
        this._subjectInfo.next(this._info);   
    }

    private _count          : number                            = 0;
    private _info           : SimpleButtonInfo                  = new SimpleButtonInfo();
    private _subjectInfo    : BehaviorSubject<SimpleButtonInfo> = new BehaviorSubject<SimpleButtonInfo>(this._info);
    private observableInfo  : Observable<SimpleButtonInfo>      = this._subjectInfo.asObservable();
}
