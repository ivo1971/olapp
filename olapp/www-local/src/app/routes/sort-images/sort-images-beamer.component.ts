import {Component}            from '@angular/core';
import {EventEmitter}         from '@angular/core';
import {Input}                from '@angular/core';
import {Observable}           from 'rxjs/Observable';
import {OnInit}               from '@angular/core';
import {OnDestroy}            from '@angular/core';
import {Output}               from '@angular/core';
import {Subscription}         from 'rxjs/Subscription';
import {IntervalObservable}   from 'rxjs/observable/IntervalObservable';

import {ComponentBase}        from './../../classes/component-base.class';

import {LogService }          from './../../services/log.service';
import {ModeService, EMode}   from './../../services/mode.service';
import {WebsocketUserService} from './../../services/websocket.user.service';

import {TeamImagesInfo }      from './team-images-info.class';

@Component({
    moduleId   : module.id,
    selector   : 'sort-images-beamer',
    styleUrls  : [
        'sort-images-beamer.component.css'
    ],
    templateUrl: 'sort-images-beamer.component.html'
})
export class SortImagesBeamerComponent extends ComponentBase { 
    /* Private variables intended for the template
     * (hence at the top)
     */
    @Input()  showTitle         : boolean                        = true;
    public    sortImages        : boolean                        = true;
    public    images            : string[]                       = [];
    public    imagesSolution    : string[]                       = [];
    public    teams             : any[]                          = [];
    @Output() teamImagesInfoEvt : EventEmitter<TeamImagesInfo[]> = new EventEmitter<TeamImagesInfo[]>();

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
        //register routing MI
        this.observableImagesListRandom = this._websocketUserService
                                             .register("sort-images-list-random")
        this.observableImagesListRandomSubscription = this.observableImagesListRandom.subscribe(
            data => {
                if(0 == this.images.length) {
                  //initialization
                  for(let u : number = 0 ; u < data.images.length ; ++u) {
                      this.images.push(data.images[u]);
                  }
                } else {
                  //other team member changed the order
                  //(assume there is no change in the size of the list)
                  //(this is an update --> change as little as possible in the array)
                  for(let u : number = 0 ; u < data.images.length ; ++u) {
                      if(this.images[u] !== data.images[u]) {
                          this.images[u] = data.images[u];
                      }
                  }
                }
            }
        );
        this.observableImagesListResult = this._websocketUserService
                                             .register("sort-images-list-result")
        this.observableImagesListResultSubscription = this.observableImagesListResult.subscribe(
            data => {
                console.log(data);
                this.sortImages = data["sort" ];
                this.teams      = data["teams"];
                let teamImagesInfo  : TeamImagesInfo[] = [];
                if(data.sort) {
                    //start sorting again
                } else {
                    //show the results
                    for(let u : number = 0 ; u < data.teams.length ; ++u) {
                        if("solution" == data.teams[u]["teamId"]) {
                            this.imagesSolution = data.teams[u].images[0];
                            data.teams.splice(u, 1);
                        }
                    }
                    for(let u : number = 0 ; u < this.teams.length ; ++u) {
                        this.teams[u]["ok"            ] = [];
                        this.teams[u]["imagesNbrOk"   ] = 0;
                        this.teams[u]["imagesNbrTotal"] = 0;
                        for(let v : number = 0 ; v < this.teams[u].images[0].length ; ++v) {
                            ++(this.teams[u]["imagesNbrTotal"]);
                            if(this.imagesSolution[v] == this.teams[u]["images"][0][v]) {
                                this.teams[u]["ok"][v] = true;
                                ++(this.teams[u]["imagesNbrOk"]);
                            } else {
                                this.teams[u]["ok"][v] = false;
                            }
                        }
                        let teamImageInfo         = new TeamImagesInfo();
                        teamImageInfo.id          = this.teams[u]["teamId"];
                        teamImageInfo.name        = this.teams[u]["teamName"];
                        teamImageInfo.imagesOk    = this.teams[u]["imagesNbrOk"];
                        teamImageInfo.imagesTotal = this.teams[u]["imagesNbrTotal"];
                        teamImagesInfo.push(teamImageInfo);
                    }
                }
                this.teamImagesInfoEvt.next(teamImagesInfo);
            }
        );

        //start sorting timer
        this.observableTimer = IntervalObservable.create(5000);
        this.observableTimerSubscription = this.observableTimer.subscribe(t => {
            this.images = this.shuffle(this.images);
        });


        //init events
        {
            let teamImagesInfo  : TeamImagesInfo[] = [];
            this.teamImagesInfoEvt.next(teamImagesInfo);
        }
    }

    public ngOnDestroy() : void {
        this.observableImagesListRandomSubscription.unsubscribe();
        this.observableImagesListResultSubscription.unsubscribe();
        this.observableTimerSubscription.unsubscribe();
    }

    /* Event handlers called from the template
     */

    /* Private functions
     */
    //source: http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    private shuffle(array : Array<any>) {
        var currentIndex:   number = array.length;
        var randomIndex:    number = 0;
        var temporaryValue: any;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    /* Private members
     */
    private observableImagesListRandom               : Observable<any>;
    private observableImagesListRandomSubscription   : Subscription;
    private observableImagesListResult               : Observable<any>;
    private observableImagesListResultSubscription   : Subscription;
    private observableTimer                          : Observable<number>;
    private observableTimerSubscription              : Subscription;
}
