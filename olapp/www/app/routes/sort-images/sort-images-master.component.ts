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
        /*
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
          */
    }

    public ngOnDestroy() : void {
        //this.observableImagesListRandomSubscription.unsubscribe();
    }

    /* Event handlers called from the template
     */
    private onClickRadioAction(sort : boolean) : void {
        this._websocketUserService.sendMsg("sort-images-action", {
            sort: sort
        });        
        
    }

    /* Private functions
     */

    /* Private members
     */
    /*
    private observableImagesListRandom               : Observable<any>;
    private observableImagesListRandomSubscription   : Subscription;
    */
}
