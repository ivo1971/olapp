import {Component}             from '@angular/core';
import {OnInit}                from '@angular/core';

import {ComponentBase}         from './../../classes/component-base.class';

import {WebsocketUserService}  from './../../services/websocket.user.service';

@Component({
    moduleId   : module.id,
    selector   : 'configure-teams-master',
    styleUrls  : [
        'configure-teams-master.component.css'
    ],
    templateUrl: 'configure-teams-master.component.html'
})
export class ConfigureTeamsMasterComponent extends ComponentBase implements OnInit { 
    /* Construction
     */
    public constructor(
        private _websocketUserService : WebsocketUserService
        ) { 
        super(_websocketUserService);
    }

    /* Life-cycle hooks
     */
    public ngOnInit() : void {
    }
}
 