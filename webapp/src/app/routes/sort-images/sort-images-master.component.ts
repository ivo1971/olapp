import {Component}            from '@angular/core';
import {Observable}           from 'rxjs/Observable';
import {OnInit}               from '@angular/core';
import {OnDestroy}            from '@angular/core';
import {IntervalObservable}   from 'rxjs/observable/IntervalObservable';
import {Subscription}         from 'rxjs/Subscription';

import {ComponentBase}        from './../../classes/component-base.class';

import {LogService }          from './../../services/log.service';
import {ModeService, EMode}   from './../../services/mode.service';
import {WebsocketUserService} from './../../services/websocket.user.service';

import {TeamImagesInfo }      from './team-images-info.class';

@Component({
    moduleId   : module.id,
    selector   : 'sort-images-master',
    styleUrls  : [
        'sort-images-master.component.css'
    ],
    templateUrl: 'sort-images-master.component.html'
})
export class SortImagesMasterComponent extends ComponentBase { 
    /* Private variables intended for the template
     * (hence at the top)
     */
    public images           : string[]         = [];
    public teams            : string[]         = [];
    public pointsPerImageOk : number           = 1;
    public teamImagesInfo   : TeamImagesInfo[] = [];

    /* Construction
     */
    public constructor(
        private logService             : LogService,
        private modeService            : ModeService,
        private _websocketUserService : WebsocketUserService,
        ) { 
        //call base class
        super(_websocketUserService);

        //inform parent
        this.sendLocation("sort");
    }

    /* Life-cycle hooks
     */
    public ngOnInit() : void {
        this.observableImagesListTeams = this._websocketUserService
                                             .register("sort-images-list-teams");
        this.observableImagesListTeamsSubscription = this.observableImagesListTeams.subscribe(
            data => {
                console.log("observableImagesListTeamsSubscription [" + data.teams.length + "]");
                console.log(data);
                this.teams.length = 0;
                for(let u = 0 ; u < data.teams.length ; ++u) {
                    this.teams.push(data.teams[u]);
                }
                console.log(this.teams);
            }
        );
    }

    public ngOnDestroy() : void {
        this.observableImagesListTeamsSubscription.unsubscribe();
    }

    /* Event handlers called from the template
     */
    public onClickRadioAction(sort : boolean) : void {
        console.log("onClickRadioAction: [" + sort + "]");
        this._websocketUserService.sendMsg("sort-images-action", {
            sort: sort
        });        
    }

    public handleTeamImagesInfoEvt(teamImagesInfo : TeamImagesInfo[]) : void {
        this.teamImagesInfo = teamImagesInfo;
        for(let u = 0 ; u < teamImagesInfo.length ; ++u) {
            this.teamImagesInfo[u].pointsRound = this.teamImagesInfo[u].imagesOk * this.pointsPerImageOk;
        }
    }

    public onClickSetPoints() : void {
        //send message to set points
        this._websocketUserService.sendMsg("sort-images-set-points", {
            teams : this.teamImagesInfo
        });        

        //route to the scoreboard
        this._websocketUserService.sendMsg("select-mode", {
            mode: "scoreboard"
        });
    }

    public onPointsPerImageChange(pointsPerImage : number) : void {
        for(let u = 0 ; u < this.teamImagesInfo.length ; ++u) {
            this.teamImagesInfo[u].pointsRound = this.teamImagesInfo[u].imagesOk * this.pointsPerImageOk;
        }
    }

    /* Private functions
     */

    /* Private members
     */
    private observableImagesListTeams               : Observable<any>;
    private observableImagesListTeamsSubscription   : Subscription;
}
