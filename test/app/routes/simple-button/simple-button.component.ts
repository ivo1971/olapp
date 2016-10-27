import {BehaviorSubject}      from 'rxjs/BehaviorSubject';
import {Component}            from '@angular/core';
import {Input}                from '@angular/core';
import {Observable}           from 'rxjs/Observable';
import {OnInit}               from '@angular/core';
import {TimerObservable}      from 'rxjs/Observable/TimerObservable';

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

        this._info.background = "info";
        this._info.pressed    = false;
        this._subjectInfo.next(this._info);   

        let timer = TimerObservable.create(5000,2000);
        timer.subscribe(t=> {
            this._count++;
            let simpleButtonTeamInfo : SimpleButtonTeamInfo = new SimpleButtonTeamInfo();
            simpleButtonTeamInfo.name       = "name [" + this._count + "]";
            simpleButtonTeamInfo.background = "danger";
            simpleButtonTeamInfo.members    = ['ivo', 'bo', 'bart', 'geert'];
            this._info.teams.push(simpleButtonTeamInfo); 
            this._info.background = "warning";
            this._info.pressed    = !this._info.pressed;
            this._subjectInfo.next(this._info);   
        });        
    }

    private _count          : number                            = 0;
    private _info           : SimpleButtonInfo                  = new SimpleButtonInfo();
    private _subjectInfo    : BehaviorSubject<SimpleButtonInfo> = new BehaviorSubject<SimpleButtonInfo>(this._info);
    private observableInfo  : Observable<SimpleButtonInfo>      = this._subjectInfo.asObservable();
}
