import {Component}             from '@angular/core';
import {Input}                 from '@angular/core';

import {TeamInfo}              from './../../classes/team-info.class';

import {WebsocketUserService}  from './../../services/websocket.user.service';

@Component({
    moduleId   : module.id,
    selector   : 'team-info',
    styleUrls  : [
        'team-info.component.css'
    ],
    templateUrl: 'team-info.component.html'
})
export class TeamInfoComponent  { 
    @Input() team    : TeamInfo;
    private nameEdit : string  = "";
    private editMode : boolean = false;

    /* Construction
     */
    public constructor(
        private websocketUserService : WebsocketUserService
        ) { 
    }

    /* Template event handlers
     */
    private onClickEdit() : void {
        this.nameEdit = this.team.name;
        this.editMode = true;
    }

    private onClickCancel() : void {
        this.editMode = false;
    }

    private onClickDelete() : void {
        this.websocketUserService.sendMsg("team-delete", {
            teamId:   this.team.id,
        });
    }

    private onClickSubmit() : void {
        this.websocketUserService.sendMsg("team-edit", {
            teamId: this.team.id,
            teamName: this.nameEdit
        });        
    }
}
