import {Component}             from '@angular/core';
import {OnInit}                from '@angular/core';
import {Observable}            from 'rxjs/Observable';

import {ComponentBase}         from './../../classes/component-base.class';
import {TeamInfo}              from './../../classes/team-info.class';

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
    private newTeamName : string = "";

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
        //register routing MI
        this.observableTeamInfo = this._websocketUserService
                                      .register("team-list")
    }

    /* Template event handlers
     */
    private onClickAddTeam(value: string) : void {
        //send the team name to the websocket
        this._websocketUserService.sendMsg("team-add", {
            teamId: this.getNewGUIDString(),
            teamName: this.newTeamName;
        });

        //clear edit box
        this.newTeamName = "";
    }

    /* Help functions
     */
    private getNewGUIDString() {
        // your favourite guid generation function could go here
        // ex: http://stackoverflow.com/a/8809472/188246
        let d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    private observableTeamInfo         : Observable<TeamInfo>;
}
 