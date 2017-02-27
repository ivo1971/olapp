/*
 * Source: https://medium.com/@mithun_daa/drag-and-drop-in-angular-2-using-native-html5-api-f628ce4edc3b#.f9thtvlmk
 * 
 */
import {Component}            from '@angular/core';
import {Observable}           from 'rxjs/Observable';
import {OnInit}               from '@angular/core';
import {OnDestroy}            from '@angular/core';
import {Subscription}         from 'rxjs/Subscription';

import {ComponentBase}        from './../../classes/component-base.class';

import {LogService }          from './../../services/log.service';
import {ModeService, EMode}   from './../../services/mode.service';
import {WebsocketUserService} from './../../services/websocket.user.service';

@Component({
    moduleId   : module.id,
    selector   : 'sort-images',
    styleUrls  : [
        'sort-images.component.css'
    ],
    templateUrl: 'sort-images.component.html'
})
export class SortImagesComponent extends ComponentBase { 
    /* Private variables intended for the template
     * (hence at the top)
     */
    private images : string[] = [
        "image 1",
        "image 2",
        "image 3",
        "image 4",
    ];

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
              console.log(data);
          });
    }

    public ngOnDestroy() : void {
        this.observableImagesListRandomSubscription.unsubscribe();
    }

    /* Event handlers called from the template
     */
    private onDrop(event: any, idxTrg : number) : void {
        console.log("onDrop [" + event + "][" + idxTrg + "]");
        let idxSrc : number = parseInt(event);
        if(idxSrc == idxTrg) {
            return;
        }
        if(idxSrc < idxTrg) {
            this.images.splice(idxTrg, 0, this.images[parseInt(event)]);
            this.images.splice(idxSrc, 1);
        } else {
            this.images.splice(idxTrg, 0, this.images[parseInt(event)]);
            this.images.splice(idxSrc + 1, 1);
        }
    }

    /* Private functions
     */

    /* Private members
     */
    private observableImagesListRandom               : Observable<any>;
    private observableImagesListRandomSubscription   : Subscription;
}
