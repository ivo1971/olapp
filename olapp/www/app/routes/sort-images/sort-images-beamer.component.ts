import {Component}            from '@angular/core';
import {Observable}           from 'rxjs/Observable';
import {OnInit}               from '@angular/core';
import {OnDestroy}            from '@angular/core';
import {Subscription}         from 'rxjs/Subscription';
import {IntervalObservable}   from 'rxjs/observable/IntervalObservable';

import {ComponentBase}        from './../../classes/component-base.class';

import {LogService }          from './../../services/log.service';
import {ModeService, EMode}   from './../../services/mode.service';
import {WebsocketUserService} from './../../services/websocket.user.service';

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
    private images : string[] = [];

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
          });

        this.observableTimer = IntervalObservable.create(5000);
        this.observableTimerSubscription = this.observableTimer.subscribe(t => {
            this.images = this.shuffle(this.images);
        });
    }

    public ngOnDestroy() : void {
        this.observableImagesListRandomSubscription.unsubscribe();
        this.observableTimerSubscription.unsubscribe();
    }

    /* Event handlers called from the template
     */

    /* Private functions
     */
    //source: http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    private shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

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
    private observableTimer                          : Observable<number>;
    private observableTimerSubscription              : Subscription;
}
